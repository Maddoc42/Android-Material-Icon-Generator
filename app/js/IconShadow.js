'use strict';

let paper = require('js/paper-core.min');

const SHADOW_ITERATIONS = 50;


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
     */
    calculateShadow() {
        var iconShadowPath = this.iconPath.clone();
        var iconPathCopy = this.iconPath.clone();

        // calculate translation such that icon is at least (!) moved (iconDiagonal, iconDiagonal) to bottom right
        var iconPathDiagonal = this.getIconPathDiagonal();
        var shadowOffset = iconPathDiagonal * 1.1 / SHADOW_ITERATIONS;
        var translation = new paper.Point(shadowOffset, shadowOffset);

        // create + translate + unite copies of shadow
        for (var i = 1; i <= SHADOW_ITERATIONS; ++i) {
            iconPathCopy.translate(translation);
            var newShadowPath = iconShadowPath.unite(iconPathCopy);
            iconShadowPath.remove();
            iconShadowPath = newShadowPath;
        }
        iconPathCopy.remove();

        // convert CompoundPath to regular Path
        newShadowPath = new paper.Path(iconShadowPath.pathData);
        iconShadowPath.remove();
        iconShadowPath = newShadowPath;

        // create 'nicer' shadow path
        this.simplifyShadowPath(iconShadowPath, shadowOffset);

        // store original shadow and apply
        iconShadowPath.remove();
        this.iconShadowPath = iconShadowPath;
        this.assertLongShadow();
    }


    /**
     * @param scale factor to scale this shadow by
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
        if (this.appliedIconShadowPath) this.appliedIconShadowPath.remove();

        // cut shadow to base
        var basePath = this.iconBase.getPathWithoutShadows();
        this.appliedIconShadowPath = this.iconShadowPath.intersect(basePath);

        // shadow color
        this.appliedIconShadowPath.fillColor = {
            gradient: {
                stops:  [
                    [new paper.Color(0, 0, 0, 0.5), 0.1],
                    [new paper.Color(0, 0, 0, 0.2), 0.8]
                ]
            },
            origin: basePath.bounds.topLeft,
            destination: basePath.bounds.bottomRight
        };

        // move shadow below icon
        this.appliedIconShadowPath.moveBelow(this.iconPath);
    }


    /**
     * Asserts that the template shadow is very (!) long such that
     * its bottom right edge will never show when moving / scaling the shadow.
     */
    assertLongShadow() {
        var points = this.getBottomRightShadowVertices();
        for (var i = 0; i < points.length; ++i) {
            var point = points[i];
            point.x = point.x + 1000000; // very long ;)
            point.y = point.y + 1000000;
        }
    }


    /**
     * Returns all vertices which belong to the bottom right edge of the shadow
     * (vertices which have to be moved to extend the length of the shadow).
     */
    getBottomRightShadowVertices() {
        var iconPathDiagonal = this.getIconPathDiagonal();
        var topLeft = this.iconShadowPath.bounds.topLeft;
        var result = [];
        for (var i = 0; i < this.iconShadowPath.segments.length; ++i) {
            var point = this.iconShadowPath.segments[i].point;
            if (topLeft.getDistance(point) <= iconPathDiagonal) continue;
            result.push(point);
        }
        return result;
    }


    getIconPathDiagonal() {
        return Math.sqrt(Math.pow(Math.max(this.iconPath.bounds.width, this.iconPath.bounds.height), 2) * 2);
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
        for (var i = 0; i < totalPoints + 3; ++i) {
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

            if (endOfMatch === true && matchCount > 0) {
                var msg = '';
                var removeCount = 0;
                for (var removeIdx  = pointIdx - 1 - matchCount; removeIdx < pointIdx - 1; ++removeIdx) {
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
        indicesToRemove.sort(function(a, b) { return a - b; }).reverse();
        for (i = 0; i < indicesToRemove.length; ++i) {
            iconShadowPath.removeSegment(indicesToRemove[i]);
        }
    }

}

module.exports = IconShadow;
