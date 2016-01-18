'use strict';

let paper = require('js/paper-core.min');

const
    SHADOW_OFFSET = 4,
    SHADOW_ITERATIONS = 50;


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
        this.iconShadowPath = this.iconPath.clone();

        var iconPathCopy = this.iconPath.clone();
        var translation = new paper.Point(SHADOW_OFFSET, SHADOW_OFFSET);

        // create + translate + unite copies of shadow
        for (var i = 1; i <= SHADOW_ITERATIONS; ++i) {
            iconPathCopy.translate(translation);
            var newShadowPath = this.iconShadowPath.unite(iconPathCopy);
            this.iconShadowPath.remove();
            this.iconShadowPath = newShadowPath;
        }
        iconPathCopy.remove();

        // convert CompoundPath to regular Path
        newShadowPath = new paper.Path(this.iconShadowPath.pathData);
        this.iconShadowPath.remove();
        this.iconShadowPath = newShadowPath;

        // create 'nicer' shadow path
        this.simplifyShadowPath();

        // cut shadow to base
        var basePath = this.iconBase.getPathWithoutShadows().clone();
        newShadowPath = this.iconShadowPath.intersect(basePath);
        this.iconShadowPath.remove();
        this.iconShadowPath = newShadowPath;

        // shadow color
        this.iconShadowPath.fillColor = {
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
        this.iconShadowPath.moveBelow(this.iconPath);
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
    simplifyShadowPath() {
        console.log(this.iconShadowPath);

        var offsetDistance = Math.round(100 * Math.sqrt(SHADOW_OFFSET * SHADOW_OFFSET * 2)) / 100;
        var doubleOffsetDistance = Math.round(100 * Math.sqrt(SHADOW_OFFSET * SHADOW_OFFSET * 2) * 2) / 100;
        var secondLastPoint;
        var lastPoint;

        var matchCount = 0;
        var endOfMatch = false;
        var indicesToRemove = [];

        // iterate over all path points and find 'close' pairs (distance equal to the offset used for creating the shadow)
        for (var i = 0; i < this.iconShadowPath.segments.length; ++i) {
            var point = this.iconShadowPath.segments[i].point;
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
            this.iconShadowPath.removeSegment(indicesToRemove[i]);
        }
        // console.log(this.iconShadowPath.pathData);
    }

}

module.exports = IconShadow;
