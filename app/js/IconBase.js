'use strict';

let paper = require('js/paper-core.min'),
    Shadow = require('js/IconBaseShadow');


class IconBackground {

    /**
     * @param center of the icon base relative to the underlying canvas
     * @param radius of the icon base
     * @param color of the icon base
     */
    constructor(center, radius, color) {
        this.lightShadow = new Shadow(center, radius, radius * 1.075, 0.21);
        this.darkShadow = new Shadow(center, radius, radius * 1.05, 0.05);

        this.base = new paper.Path.Circle({
            center: center,
            radius: radius
        });
        this.base.fillColor = color;
        this.base.strokeWidth = 0;
    }

    setColor(color) {
        this.base.fillColor = color;
    }

    setCenter(center) {
        this.base.center = center;
        this.lightShadow.setCenter(center);
        this.darkShadow.setCenter(center);
    }

    getShapeWithoutShadows() {
        return this.base;
    }

}

module.exports = IconBackground;
