'use strict';

let paper = require('js/index/paper-core.min'),
    paperScope = require('js/index/PaperScopeManager');

const SHADOW_ITERATIONS = 30;


class IconShadow {

    /**
     * @param iconPath path of the icon used to construct the shadow
     * @param iconBase of the icon used to cut the shadow
     */
    constructor(iconPath, iconBase) {
        this.iconPath = iconPath;
        this.iconBase = iconBase;
    }


    /**
     * Calculates the shadow but does not (!) apply it.
     * @param callback for when shadow computation is finished.
     */
    calculateShadow(callback) {
        let iconShadowPath = this.getOutlinePaths(this.iconPath)[0];
        let iconPathCopy = iconShadowPath.clone();

        // calculate translation such that icon is at least (!) moved (iconDiagonal, iconDiagonal) to bottom right
        let iconPathDiagonal = this.getIconPathDiagonal();
        let shadowOffset = iconPathDiagonal * 1.1 / SHADOW_ITERATIONS;
        let translation = new paper.Point(shadowOffset, shadowOffset);

        this.calculateShadowIteration(
            callback,
            {
                iconShadowPath: iconShadowPath,
                iconPathCopy: iconPathCopy,
                shadowOffset: shadowOffset,
                translation: translation
            },
            1);
    }


    /**
     * What's up with this complicated recursive computation thing?
     * JS is hard core single threaded (gnaaa ...) and blocks the UI if used too heavily.
     * Calculating the shadow requires lots of CPU, so here the computation is paused
     * every now and then to let the UI do at least some minor updates.
     */
    calculateShadowIteration(callback, data, currentIteration) {
        if (currentIteration <= SHADOW_ITERATIONS) {
            ++currentIteration;
            data.iconPathCopy.translate(data.translation);
            let newShadowPath = data.iconShadowPath.unite(data.iconPathCopy);
            data.iconShadowPath.remove();
            data.iconShadowPath = newShadowPath;
            if (currentIteration % 20 == 0) {
                setTimeout(function () {
                    this.calculateShadowIteration(callback, data, currentIteration);
                }.bind(this), 20);
            } else {
                this.calculateShadowIteration(callback, data, currentIteration);
            }
            return;
        }
        data.iconPathCopy.remove();

        // TODO
        // remove possible holes from shadow
        let newIconShadowPath = this.getOutlinePaths(data.iconShadowPath)[0];
        data.iconShadowPath.remove();
        data.iconShadowPath = newIconShadowPath;

        // sometimes duplicate points are creating by converting to regular path --> remove!
        this.removeDuplicatePoints(data.iconShadowPath);

        // create 'nicer' shadow path
        this.simplifyShadowPath(data.iconShadowPath, data.shadowOffset);

        // store original shadow and apply
        data.iconShadowPath.remove();
        this.iconShadowPath = data.iconShadowPath;
        this.assertLongShadow();

        callback();
    }


    /**
     * @param scale factor to scale this shadow by.
     */
    scale(scale) {
        this.iconShadowPath.scale(scale, this.iconPath.position);
        this.applyShadow();
    }


    /**
     * Remove this shadow form the canvas.
     */
    remove() {
        this.iconShadowPath.remove();
        if (this.appliedIconShadowPath) this.appliedIconShadowPath.remove();
    }


    /**
     * this.iconShadowPath is not actually visible on the canvas, but
     * rather serves as a template for the actual shadow path which is
     * cut to fit the base.
     */
    applyShadow() {
        // cut shadow to base
        let basePath = this.iconBase.getPathWithoutShadows();
        let newAppliedIconShadowPath = this.iconShadowPath.intersect(basePath);
        if (this.appliedIconShadowPath) {
            this.appliedIconShadowPath.replaceWith(newAppliedIconShadowPath);
        }
        this.appliedIconShadowPath = newAppliedIconShadowPath;

        // move shadow below icon
        this.appliedIconShadowPath.moveBelow(this.iconPath);

        // reapply color (if any)
        if (this.startIntensity && this.endIntensity) {
            this.setIntensity(this.startIntensity, this.endIntensity);
        }
    }


    /**
     * Sets the shadow intensity (color is always black).
     * @param startIntensity intensity at icon center. Value between 0 and 1.
     * @param endIntensity intensity at base edge. Value between 0 and 1.
     */
    setIntensity(startIntensity, endIntensity) {
        this.startIntensity = startIntensity;
        this.endIntensity = endIntensity;

        let basePath = this.iconBase.getPathWithoutShadows();
        this.appliedIconShadowPath.fillColor = {
            gradient: {
                stops: [
                    [new paper.Color(0, 0, 0, startIntensity), 0.1],
                    [new paper.Color(0, 0, 0, endIntensity), 0.8]
                ]
            },
            origin: basePath.bounds.topLeft,
            destination: basePath.bounds.bottomRight
        };
        paperScope.draw().view.draw();
    }


    /**
     * Removes 'holes' from paths and returns all paths  which together from the outline of
     * the given path. The return paths will have been inserted into the project and are a
     * clone from the original.
     * @param {paper.PathItem} pathItem - input path
     * @returns {paper.PathItem[]} - an array containing the paths.
     */
    getOutlinePaths(pathItem) {
        if (pathItem instanceof paper.Path) {
            return [ pathItem.clone() ];
        }
        if (!(pathItem instanceof paper.CompoundPath)) {
            console.warn('unknown path class');
            console.warn(pathItem);
            return [];
        }

        let children = [];
        for (let i = 0; i < pathItem.children.length; ++i) {
            let path = pathItem.children[i];
            if (!(path instanceof paper.Path)) {
                console.warn('child is not a paper.Path!');
                console.warn(path);
                continue;
            }
            children.push(path);
        }
        children.sort(function(a, b) {
            return Math.abs(a.area) - Math.abs(b.area);
        });
        return [ new paper.Path(children[children.length - 1].pathData) ];
    }


    /**
     * Asserts that the template shadow is very (!) long such that
     * its bottom right edge will never show when moving / scaling the shadow.
     */
    assertLongShadow() {
        let points = this.getBottomRightShadowVertices();
        for (let i = 0; i < points.length; ++i) {
            let point = points[i];
            point.x = point.x + 1000000; // very long ;)
            point.y = point.y + 1000000;
        }
    }


    /**
     * Returns all vertices which belong to the bottom right edge of the shadow
     * (vertices which have to be moved to extend the length of the shadow).
     */
    getBottomRightShadowVertices() {
        let iconPathDiagonal = this.getIconPathDiagonal();
        let topLeft = this.iconShadowPath.bounds.topLeft;
        let result = [];
        for (let i = 0; i < this.iconShadowPath.segments.length; ++i) {
            let point = this.iconShadowPath.segments[i].point;
            if (topLeft.getDistance(point) <= iconPathDiagonal) continue;
            result.push(point);
        }
        return result;
    }


    getIconPathDiagonal() {
        return Math.sqrt(Math.pow(Math.max(this.iconPath.bounds.width, this.iconPath.bounds.height), 2) * 2);
    }


    removeDuplicatePoints(iconShadowPath) {
        if (iconShadowPath instanceof paper.CompoundPath) {
            for (let i = 0; i < iconShadowPath.children.length; ++i) {
                this.removeDuplicatePoints(iconShadowPath.children[i]);
            }
            return;
        }

        var totalPoints = iconShadowPath.segments.length;
        var previousPoint;
        var indicesToRemove = [];

        for (let i = 0; i < totalPoints + 1; ++i) {
            var pointIdx = i % totalPoints;
            var point = iconShadowPath.segments[pointIdx].point;

            if (previousPoint) {
                var distance = point.getDistance(previousPoint);
                if (distance < 0.0001) indicesToRemove.push(pointIdx);
            }

            previousPoint = point;
        }

        this.removePointsByIndices(iconShadowPath, indicesToRemove);
    }

    /**
     * Simplifies the path of a shadow by searching for unnecessary points which were created
     * while shifting the original icon path.
     *
     * Example:
     *
     * o
     *   o
     *     o
     *
     * Would be simplified to:
     *
     * o
     *
     *     o
     */
    simplifyShadowPath(iconShadowPath, shadowOffset) {
        var offsetDistance = Math.round(100 * Math.sqrt(shadowOffset * shadowOffset * 2)) / 100;
        var doubleOffsetDistance = Math.round(100 * Math.sqrt(shadowOffset * shadowOffset * 2) * 2) / 100;
        var secondLastPoint;
        var lastPoint;

        var matchCount = 0;
        var endOfMatch = false;
        var indicesToRemove = [];

        // iterate over all path points and find 'close' pairs (distance equal to the offset used for creating the shadow)
        var totalPoints = iconShadowPath.segments.length;
        var totalIterCount = totalPoints + 3; // + 3 in case start point should also be removed

        for (let i = 0; i < totalIterCount; ++i) {
            var pointIdx = i % totalPoints;
            var point = iconShadowPath.segments[pointIdx].point;

            if (secondLastPoint) {
                var distance = Math.round(100 * point.getDistance(secondLastPoint)) / 100;
                if (distance === offsetDistance || distance === doubleOffsetDistance) {
                    ++matchCount;
                    endOfMatch = false;
                } else {
                    endOfMatch = true;
                }
            }

            if ((endOfMatch === true || i === totalIterCount - 1) && matchCount > 0) {
                var msg = '';
                var removeCount = 0;
                for (var removeIdx = pointIdx - 1 - matchCount; removeIdx < pointIdx - 1; ++removeIdx) {
                    ++removeCount;
                    msg = msg + pointIdx + ', ';
                    indicesToRemove.push(removeIdx < 0 ? removeIdx + totalPoints : removeIdx);
                }
                matchCount = 0;
                endOfMatch = true;
            }

            secondLastPoint = lastPoint;
            lastPoint = point;
        }

        // actually remove indices from iconShadowPath
        this.removePointsByIndices(iconShadowPath, indicesToRemove);
    }


    removePointsByIndices(path, indicesToRemove) {
        indicesToRemove.sort(function (a, b) {
            return a - b;
        }).reverse();
        for (var i = 0; i < indicesToRemove.length; ++i) {
            path.removeSegment(indicesToRemove[i]);
        }

    }

}

module.exports = IconShadow;
