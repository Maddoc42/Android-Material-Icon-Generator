'use strict';


const
    SHAPE_CIRCLE = 0,
    SHAPE_SQUARE = 1,
    SHAPE_SQUARE_NO_RADIUS = 2;

class IconBase {

    static ID() {
        return 'base 1';
    }

    /**
     * @param center - of the icon base relative to the underlying canvas
     * @param radius - of the icon base
     */
    constructor(center, radius) {
        this.circleBasePath = new paper.Path.Circle({
            center: center,
            radius: radius,
            shadowColor: new paper.Color(0, 0, 0, 0.4),
            shadowBlur: 2,
            shadowOffset: new paper.Point(0, 1),
            name: IconBase.ID()
        });
        this.shape = SHAPE_CIRCLE;

        this.squareBasePath = new paper.Path.Rectangle({
            point: new paper.Point(center.x - radius, center.y - radius),
            size: new paper.Size(radius * 2, radius * 2),
            radius: 2,
            shadowColor: this.circleBasePath.shadowColor,
            shadowBlur: this.circleBasePath.shadowBlur,
            shadowOffset: this.circleBasePath.shadowOffset,
            name: IconBase.ID()
        });
        this.squareBasePath.remove();

        this.squareNoRadiusBasePath = new paper.Path.Rectangle({
            point: new paper.Point(center.x - radius, center.y - radius),
            size: new paper.Size(radius * 2, radius * 2),
            radius: 0,
            shadowColor: 0,
            shadowBlur: 0,
            shadowOffset: 0,
            name: IconBase.ID()
        });
        this.squareNoRadiusBasePath.remove();
    }

    setSquareShape() {
        this.squareNoRadiusBasePath.replaceWith(this.squareBasePath);
        this.circleBasePath.replaceWith(this.squareBasePath);
        this.shape = SHAPE_SQUARE;
    }

    setCircularShape() {
        this.squareNoRadiusBasePath.replaceWith(this.circleBasePath);
        this.squareBasePath.replaceWith(this.circleBasePath);
        this.shape = SHAPE_CIRCLE;
    }

    setSquareNoRadiusShape() {
        this.squareBasePath.replaceWith(this.squareNoRadiusBasePath);
        this.circleBasePath.replaceWith(this.squareNoRadiusBasePath);
        this.shape = SHAPE_SQUARE_NO_RADIUS;
    }

    setColor(color) {
        this.circleBasePath.fillColor = color;
        this.squareBasePath.fillColor = color;
        this.squareNoRadiusBasePath.fillColor = color;
    }

    setCenter(center) {
        this.circleBasePath.center = center;
        this.squareBasePath.center = center;
        this.squareNoRadiusBasePath.center = center;
    }

    getPathWithoutShadows() {
        if (this.shape === SHAPE_CIRCLE) return this.circleBasePath;
        else if (this.shape == SHAPE_SQUARE) return this.squareBasePath;
        else if (this.shape == SHAPE_SQUARE_NO_RADIUS) return this.squareNoRadiusBasePath;
        console.warn('unknown base shape type ' + this.shape);
    }

    /**
     * Remove this base + shadow from canvas.
     */
    remove() {
        this.circleBasePath.remove();
        this.squareBasePath.remove();
        this.squareNoRadiusBasePath.remove();
    }

}

module.exports = IconBase;
