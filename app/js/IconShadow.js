'use strict';

let paper = require('js/paper-core.min'),
    paperScope = require('js/PaperScopeManager');

const TARGET_ANGLE = Math.PI / 4;


class IconShadow {

    /**
     * @param iconPath path of the icon used to construct the shadow
     * @param iconBase of the icon used to cut the shadow
     */
    constructor(iconPath, iconBase) {
        this.iconBase = iconBase;
        this.iconPath = iconPath;

        let outlineIconPaths = this.getOutlinePaths(iconPath);
        for (let outlineIdx = 0; outlineIdx < outlineIconPaths.length; ++outlineIdx) {
            let path = outlineIconPaths[outlineIdx];
            let subPaths = [];
            let tangent = this.findNextTangent(path);

            // cut path along tangents into sub paths
            path.split(tangent.curveIdx, tangent.timeParams[0]);
            while (path && (tangent = this.findNextTangent(path))) {
                let newPath = path.split(tangent.curveIdx, tangent.timeParams[0]);
                subPaths.push(path);
                path = newPath;
            }
            if (path) subPaths.push(path);

            // create shadow sub shapes
            let translation = new paper.Point(5000, 5000);
            for (let i = 0; i < subPaths.length; ++i) {
                let subPath = subPaths[i];

                let firstSegment = subPath.firstSegment;
                firstSegment.handleIn.x = 0;
                firstSegment.handleIn.y = 0;
                firstSegment = new paper.Segment(firstSegment.point.add(translation));

                let lastSegment = subPath.lastSegment;
                lastSegment.handleOut.x = 0;
                lastSegment.handleOut.y = 0;
                lastSegment = new paper.Segment(lastSegment.point.add(translation));

                subPath.insert(0, firstSegment);
                subPath.add(lastSegment);
                subPath.closed = true;
            }

            // join all sub paths into final shadow
            let shadowPath = new paper.Path(subPaths[0].pathData);
            subPaths[0].remove();
            for (let i = 1; i < subPaths.length; ++i) {
                let subPathCopy = new paper.Path(subPaths[i].pathData);
                let newShadowPath = shadowPath.unite(subPathCopy);
                subPathCopy.remove();
                subPaths[i].remove();
                shadowPath.remove();
                shadowPath = newShadowPath;
            }

            // join with previous shadows
            if (!this.iconShadowPath) {
                this.iconShadowPath = shadowPath;
            } else {
                let newIconShadowPath = this.iconShadowPath.unite(shadowPath);
                this.iconShadowPath.remove();
                shadowPath.remove();
                this.iconShadowPath = newIconShadowPath;
            }
        }

        // store shadow template and cut with base
        this.applyShadow();
    }


    findNextTangent(path) {
        // go over each curve and try finding tangent with target angle
        for (let i = 0; i < path.curves.length; ++i) {
            let curve = path.curves[i];

            // search for tangent within curve
            let timeParams = this.findNextTangentFromCurve(curve);
            if (timeParams.length > 0) {
                // don't split curve right at the beginning (otherwise it might never stop splitting there ...)
                if (i === 0 && timeParams[0] < 1E-10) {
                    timeParams.splice(0, 1);
                    if (timeParams.length === 0) continue;
                }

                return {
                    curveIdx: i,
                    timeParams: timeParams
                };
            }

            // check for hard edges between this and the next curve
            let nextCurve = path.curves[(i + 1) % path.curves.length];
            let hardEdge = (curve.handle2.x === 0 && curve.handle2.y === 0) || (nextCurve.handle1.x === 0 || nextCurve.handle1.y === 0);
            hardEdge = hardEdge || (Math.abs(curve.getTangentAt(1, true).angle - nextCurve.getTangentAt(0, true).angle) > 1E-10);
            if (!hardEdge) continue;
            // (possible) TODO
            // Currently path will be split along every hard edge. This might not be super efficient for very large paths.
            return {
                curveIdx: i,
                timeParams: [1]
            };
        }
        return undefined;
    }


    findNextTangentFromCurve(curve) {
        // in case of missing handles return
        if (curve.handle1.x === 0 && curve.handle1.y === 0 && curve.handle2.x === 0 && curve.handle2.y === 0) {
            return [];
        }

        // find tangent with target angle (45 degrees)
        let points = [
            curve.point1,
            curve.point1.add(curve.handle1),
            curve.point2.add(curve.handle2),
            curve.point2
        ];

        let a = {};
        let b = {};
        let c = {};

        a.x = 3 * points[3].x - 9 * points[2].x + 9 * points[1].x - 3 * points[0].x;
        a.y = 3 * points[3].y - 9 * points[2].y + 9 * points[1].y - 3 * points[0].y;

        b.x = 6 * points[2].x - 12 * points[1].x + 6 * points[0].x;
        b.y = 6 * points[2].y - 12 * points[1].y + 6 * points[0].y;

        c.x = 3 * points[1].x - 3 * points[0].x;
        c.y = 3 * points[1].y - 3 * points[0].y;


        let t = {
            x: Math.cos(TARGET_ANGLE),
            y: Math.sin(TARGET_ANGLE)
        };

        let timeParams = [];
        let den = 2 * a.x * t.y - 2 * a.y * t.x;
        if (Math.abs(den) < 1E-10) {
            let num = a.x * c.y - a.y * c.x;
            den = a.x * b.y - a.y * b.x;
            if (den != 0) {
                let time = -num / den;
                if (time >= 0 && time <= 1) timeParams.push(time);
            }
        } else {
            let delta = (b.x * b.x - 4 * a.x * c.x) * t.y * t.y + (-2 * b.x * b.y + 4 * a.y * c.x + 4 * a.x * c.y) * t.x * t.y + (b.y * b.y - 4 * a.y * c.y) * t.x * t.x;
            let k = b.x * t.y - b.y * t.x;
            timeParams = [];
            if (delta >= 0 && den != 0) {
                let d = Math.sqrt(delta);
                let t0 = -(k + d) / den;
                let t1 = (-k + d) / den;

                if (Math.abs(t0 - 1) < 1E-5) t0 = 1;
                if (Math.abs(t1 - 1) < 1E-5) t1 = 1;

                if (t0 >= 0 && t0 < 1) timeParams.push(t0);
                if (t1 >= 0 && t1 < 1) timeParams.push(t1);
            }
        }
        if (timeParams.length === 0) return timeParams;

        // clean values
        for (let i = 0; i < timeParams.length; ++i) {
            let time = timeParams[i];

            // if very close to 0, set value to 0
            if (time < 1E-10) {
                timeParams[i] = 0;
                continue;
            }

            // if very close to 1, set value to 1
            time = Math.abs(1 - time);
            if (time < 1E-10) {
                timeParams[i] = 1;
                continue;
            }
        }

        timeParams.sort(function(a, b) { return a - b; });
        return timeParams;
    }



    /**
     * @param scale factor to scale this shadow by.
     */
    scale(scale) {
        this.iconShadowPath.scale(scale, this.iconPath.position);
        this.applyShadow();
    }


    /**
     * @param {paper.Point} delta - how much this icon + shadow should be moved.
     */
    move(delta) {
        this.iconShadowPath.position = this.iconShadowPath.position.add(delta);
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

        // save shadow
        if (this.appliedIconShadowPath) {
            this.appliedIconShadowPath.replaceWith(newAppliedIconShadowPath);
            newAppliedIconShadowPath.fillColor = this.appliedIconShadowPath.fillColor;

        } else {
            // create default gradient
            newAppliedIconShadowPath.fillColor = {
                gradient: {
                    stops: [
                        [new paper.Color(0, 0, 0, 1), 0],
                        [new paper.Color(0, 0, 0, 0), 1]
                    ]
                },
                origin: basePath.bounds.topLeft,
                destination: basePath.bounds.bottomRight
            }

        }
        this.appliedIconShadowPath = newAppliedIconShadowPath;

        // move shadow below icon
        this.appliedIconShadowPath.moveBelow(this.iconPath);
    }


    /**
     * Sets the length of this shadow (diagonal)
     * @param {Number} length
     */
    setLength(length) {
        let xDistance = Math.sqrt(length * length / 2);
        let destination = this.appliedIconShadowPath.fillColor.origin.add(xDistance);
        this.appliedIconShadowPath.fillColor.destination = destination;
    }


    /**
     * Sets the start intensity of this shadow.
     * @param {Number} intensity - between 0 and 1.
     */
    setIntensity(intensity) {
        this.appliedIconShadowPath.fillColor.gradient.stops[0].color.alpha = intensity;
        // hack: just chaning alpha does not trigger a redraw, 'change' this as well
        this.appliedIconShadowPath.fillColor.destination = this.appliedIconShadowPath.fillColor.destination;
    }


    /**
     * Sets where the shadow should begin fading.
     * @param {Number} fading - between 0 and 1. 0 Start fading right away, 1 never fade.
     */
    setFading(fading) {
        this.appliedIconShadowPath.fillColor.gradient.stops[0].rampPoint = fading;
        // hack: just chaning alpha does not trigger a redraw, 'change' this as well
        this.appliedIconShadowPath.fillColor.destination = this.appliedIconShadowPath.fillColor.destination;
    }


    /**
     * Removes 'holes' from paths and returns all paths which together from the outline of
     * the given path. The return paths will have been inserted into the project and are a
     * clone from the original.
     * @param {paper.PathItem} pathItem - input path
     * @returns {paper.PathItem[]} - an array containing the paths.
     */
    getOutlinePaths(pathItem) {
        if (pathItem instanceof paper.Path) {
            return [ new paper.Path(pathItem.pathData) ];
        }
        if (!(pathItem instanceof paper.CompoundPath)) {
            console.warn('unknown path class');
            console.warn(pathItem);
            return [];
        }

        // copy children and skip non paper.Path objects
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

        // sort ascending by area
        children.sort(function(a, b) {
            return Math.abs(a.area) - Math.abs(b.area);
        });

        // find largest areas which do not overlap with others
        let resultPaths = [];
        outerLoop:
            for (let i = 0; i < children.length; ++i) {
                let path = children[i];
                let insidePoint = path.interiorPoint;
                for (let j = i + 1; j < children.length; ++j) {
                    if (children[j].contains(insidePoint)) continue outerLoop;
                }
                resultPaths.push(new paper.Path(path.pathData));
            }

        return resultPaths;
    }

}

module.exports = IconShadow;
