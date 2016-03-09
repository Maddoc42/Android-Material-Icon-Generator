'use strict';

let paper = require('js/paper-core.min'),
    paperScope = require('js/PaperScopeManager');

const
    SHAPE_CIRCLE = 0,
    SHAPE_SQUARE = 1;

class IconBase {

    /**
     * @param center - of the icon base relative to the underlying canvas
     * @param radius - of the icon base
     */
    constructor(center, radius) {
        this.circleBasePath = new paper.Path.Circle({
            center: center,
            radius: radius,
            shadowColor: new paper.Color(0, 0, 0, 0.6),
            shadowBlur: 10,
            shadowOffset: new paper.Point(0, 3)
        });
        this.shape = SHAPE_CIRCLE;

        this.squareBasePath = new paper.Path.Rectangle({
            point: new paper.Point(center.x - radius, center.y - radius),
            size: new paper.Size(radius * 2, radius * 2),
            radius: 2,
            shadowColor: new paper.Color(0, 0, 0, 0.6),
            shadowBlur: 10,
            shadowOffset: new paper.Point(0, 3)
        });
        this.squareBasePath.remove();

    }

    setSquareShape() {
        this.circleBasePath.replaceWith(this.squareBasePath);
        this.shape = SHAPE_SQUARE;
    }

    setCircularShape() {
        this.squareBasePath.replaceWith(this.circleBasePath);
        this.shape = SHAPE_CIRCLE;
    }

    setColor(color) {
        this.circleBasePath.fillColor = color;
        this.squareBasePath.fillColor = color;
    }

    setCenter(center) {
        this.circleBasePath.center = center;
        this.squareBasePath.center = center;
    }

    getPathWithoutShadows() {
        if (this.shape === SHAPE_CIRCLE) return this.circleBasePath;
        else if (this.shape == SHAPE_SQUARE) return this.squareBasePath;
        console.warn('unknown base shape type ' + this.shape);
    }

    /**
     * Remove this base + shadow from canvas.
     */
    remove() {
        this.circleBasePath.remove();
        this.squareBasePath.remove();
    }

}

module.exports = IconBase;
