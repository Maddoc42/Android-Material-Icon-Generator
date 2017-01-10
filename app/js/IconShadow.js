'use strict';

const
    INITIAL_SHADOW_LENGTH = 2000,
    TARGET_ANGLE = Math.PI / 4;


class IconShadow {

    /**
     * @param iconPath path of the icon used to construct the shadow
     * @param iconBase of the icon used to cut the shadow
     */
    constructor(iconPath, iconBase) {
        this.iconBase = iconBase;
        this.iconPath = iconPath;

        this.iconShadowPaths = [];

        let outlineIconPaths = this.getAndCopyPaths(iconPath);
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
            let xyTranslation = Math.sqrt(INITIAL_SHADOW_LENGTH * INITIAL_SHADOW_LENGTH / 2);
            let translation = new paper.Point(xyTranslation, xyTranslation);
            for (let i = 0; i < subPaths.length; ++i) {
                let subPath = subPaths[i];

                // offset + insert all segments to create closed form
                for (let j = subPath.segments.length - 1; j >= 0; --j) {
                    let segment = subPath.segments[j];
                    // make shade edges 'sharp'
                    if (j === subPath.segments.length -1) {
                        segment.handleOut.x = 0;
                        segment.handleOut.y = 0;
                    }
                    if (j === 0) {
                        segment.handleIn.x = 0;
                        segment.handleIn.y = 0;
                    }
                    subPath.add(new paper.Segment(segment.point.add(translation), segment.handleOut, segment.handleIn));
                }
                subPath.closed = true;

                this.iconShadowPaths.push(subPath.clone());
            }
        }

        // find bottom right edge of shadow (for changing length)
        this.iconShadowBottomRightSegments = [];
        this.iconShadowPaths.forEach(function(path) {
            this.iconShadowBottomRightSegments = this.iconShadowBottomRightSegments.concat(this.findBottomRightSegments(path));
        }.bind(this));
        this.length = INITIAL_SHADOW_LENGTH;

        // store shadow template and cut with base
        this.applyShadow();
    }


    findNextTangent(path) {
        // go over each curve and try finding tangent with target angle
        outer: for (let i = 0; i < path.curves.length; ++i) {
            let curve = path.curves[i];

            // search for tangent within curve
            let timeParams = this.findNextTangentFromCurve(curve);
            if (timeParams.length > 0) {
                // don't split curve right at the beginning (otherwise it might never stop splitting there ...)
                while (i === 0 && timeParams[0] < 1E-10) {
                    timeParams.splice(0, 1);
                    if (timeParams.length === 0) continue outer;
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

                if (t0 >= 0 && t0 <= 1) timeParams.push(t0);
                if (t1 >= 0 && t1 <= 1) timeParams.push(t1);
            }
        }
        if (timeParams.length === 0) return timeParams;

        // clean values
        for (let i = 0; i < timeParams.length; ++i) {
            let time = timeParams[i];

            // if very close to 0, set value to 0
            if (time < 1E-5) {
                timeParams[i] = 0;
                continue;
            }

            // if very close to 1, set value to 1
            time = Math.abs(1 - time);
            if (time < 1E-5) {
                timeParams[i] = 1;
                continue;
            }
        }

        timeParams.sort(function(a, b) { return a - b; });
        return timeParams;
    }


    findBottomRightSegments(path) {
        let segments = [];
        if (path instanceof paper.CompoundPath) {
            for (let i = 0; i < path.children.length; ++i) {
                segments = segments.concat(this.findBottomRightSegments(path.children[i]));
            }

        } else {
            for (let i = 0; i < path.segments.length; ++i) {
                let segment = path.segments[i];
                if (segment.point.getDistance(this.iconPath.bounds.topLeft) >= INITIAL_SHADOW_LENGTH * 0.95) {
                    segments.push(segment);
                }
            }
        }

        return segments;
    }


    /**
     * @param scale factor to scale this shadow by.
     */
    scale(scale) {
        this.iconShadowPaths.forEach(function(path) {
            path.scale(scale, this.iconPath.position);
        }.bind(this));
        this.unitedIconShadowPath.scale(scale, this.iconPath.position);
        this.length = this.length * scale;
        this.applyShadow();
    }


    /**
     * @param {paper.Point} delta - how much this icon + shadow should be moved.
     */
    move(delta) {
        this.iconShadowPaths.forEach(function(path) {
            path.position = path.position.add(delta);
        });
        this.unitedIconShadowPath.position = this.unitedIconShadowPath.position.add(delta);
        this.applyShadow();
    }


    /**
     * Remove this shadow form the canvas.
     */
    remove() {
        this.iconShadowPaths.forEach(function(path) {
            path.remove();
        });
        if (this.unitedIconShadowPath) this.unitedIconShadowPath.remove();
        if (this.appliedIconShadowPath) this.appliedIconShadowPath.remove();
    }


    /**
     * Cut the shadow path template(s) to base size. This creates the
     * final shadow path.
     */
    applyShadow() {
        // join sub shadows to from one path
        if (!this.unitedIconShadowPath) this.createUnitedIconShadowPath();

        // cut shadow to base
        let basePath = this.iconBase.getPathWithoutShadows();
        let newAppliedIconShadowPath = this.unitedIconShadowPath.intersect(basePath);

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
                }
            }

        }
        this.appliedIconShadowPath = newAppliedIconShadowPath;
        this.updateAppliedIconShadowPathGradientBounds();

        // move shadow below icon
        this.appliedIconShadowPath.moveBelow(this.iconPath);
    }


    /**
     * Unites all shadow parts to one shadow shape (doesn't intersect with base though,
     * hence can be used as a 'template').
     * Don't call this too often though, uniting shapes is CPU intensive.
     */
    createUnitedIconShadowPath() {
        if (this.unitedIconShadowPath) this.unitedIconShadowPath.remove();
        this.unitedIconShadowPath = this.iconShadowPaths[0].clone();
        for (let i = 1; i < this.iconShadowPaths.length; ++i) {
            let subPathCopy = this.iconShadowPaths[i].clone();
            let newShadowPath = this.unitedIconShadowPath.unite(subPathCopy);
            subPathCopy.remove();
            this.unitedIconShadowPath.remove();
            this.unitedIconShadowPath = newShadowPath;
        }
    }


    /**
     * Sets the length of this shadow (diagonal)
     * @param {Number} length
     */
    setLength(length) {
        let deltaLength = length - this.length;
        let translation = Math.sqrt(deltaLength * deltaLength / 2);
        if (deltaLength < 0) translation = translation * -1;

        for (let i = 0; i < this.iconShadowBottomRightSegments.length; ++i) {
            let segment = this.iconShadowBottomRightSegments[i];
            segment.point = segment.point.add(translation);
        }

        this.length = length;
        this.createUnitedIconShadowPath();
        this.applyShadow();
    }


    /**
     * Sets the start intensity of this shadow.
     * @param {Number} intensity - between 0 and 1.
     */
    setIntensity(intensity) {
        this.appliedIconShadowPath.fillColor.gradient.stops[0].color.alpha = intensity;
        // hack: just changing alpha does not trigger a redraw, 'change' this as well
        this.appliedIconShadowPath.fillColor.destination = this.appliedIconShadowPath.fillColor.destination;
    }


    /**
     * Sets where the shadow should begin fading.
     * @param {Number} fading - between 0 and 1. 1 Start fading right away, 0 never fade.
     */
    setFading(fading) {
        this.appliedIconShadowPath.fillColor.gradient.stops[0].rampPoint = 1 - fading;
        // hack: just changing alpha does not trigger a redraw, 'change' this as well
        this.appliedIconShadowPath.fillColor.destination = this.appliedIconShadowPath.fillColor.destination;
    }


    updateAppliedIconShadowPathGradientBounds() {
        let bounds = this.unitedIconShadowPath.bounds;
        this.appliedIconShadowPath.fillColor.origin = bounds.topLeft;
        this.appliedIconShadowPath.fillColor.destination = bounds.bottomRight;
    }


    /**
     * Copies and returns all paths from a given Path / CompoundPath object.
     */
    getAndCopyPaths(pathItem) {
        if (pathItem instanceof paper.Path) {
            const result = [ new paper.Path(pathItem.pathData) ];
            result[0].position = pathItem.position.clone();
            return result;
        }

        // copy children
        const children = [];
        for (let i = 0; i < pathItem.children.length; ++i) {
            children.push(new paper.Path(pathItem.children[i].pathData));
        }
        return children;
    }

}

module.exports = IconShadow;
