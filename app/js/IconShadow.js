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


    calculateShadow() {
        var iconShadowPath = this.iconPath.clone();
        var iconPathCopy = this.iconPath.clone();

        // calculate translation such that icon is at least moved (iconDiagonal, iconDiagonal) to bottom right
        var iconPathDiagonal = Math.sqrt(Math.pow(Math.max(this.iconPath.bounds.width, this.iconPath.bounds.height), 2) * 2);
        var shadowOffset = iconPathDiagonal / SHADOW_ITERATIONS;
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

        // cut shadow to base
        var basePath = this.iconBase.getPathWithoutShadows();
        newShadowPath = iconShadowPath.intersect(basePath);
        iconShadowPath.remove();
        iconShadowPath = newShadowPath;

        // shadow color
        iconShadowPath.fillColor = {
            gradient: {
                stops:  [
                    [new paper.Color(0, 0, 0, 0.3), 0.1],
                    [new paper.Color(0, 0, 0, 0), 0.8]
                ]
            },
            origin: basePath.bounds.topLeft,
            destination: basePath.bounds.bottomRight
        };

        // move shadow below icon
        iconShadowPath.moveBelow(this.iconPath);
        this.iconShadowPath = iconShadowPath;
    }


    /**
     * @param scale factor to scale this shadow by
     */
    scale(scale) {
        this.iconShadowPath.scale(scale, this.iconPath.position);
    }


    /**
     * Remove this shadow form the canvas.
     */
    remove() {
        this.iconShadowPath.remove();
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
        for (var i = 0; i < iconShadowPath.segments.length; ++i) {
            var point = iconShadowPath.segments[i].point;
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
                for (var pointIdx = i - 1 - matchCount; pointIdx < i - 1; ++pointIdx) {
                    msg = msg + pointIdx + ', ';
                    indicesToRemove.push(pointIdx);
                }
                matchCount = 0;
                endOfMatch = true;
            }

            secondLastPoint = lastPoint;
            lastPoint = point;
        }

        // actually remove indices from iconShadowPath
        indicesToRemove.reverse();
        for (i = 0; i < indicesToRemove.length; ++i) {
            iconShadowPath.removeSegment(indicesToRemove[i]);
        }
    }

}

module.exports = IconShadow;
