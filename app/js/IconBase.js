'use strict';

let paper = require('js/paper-core.min'),
    IconBaseShadow = require('js/IconBaseShadow'),
    paperScope = require('js/PaperScopeManager');


class IconBase {

    /**
     * @param center of the icon base relative to the underlying canvas
     * @param radius of the icon base
     */
    constructor(center, radius) {
        this.lightShadow = new IconBaseShadow(center, radius, radius * 1.075, 0.21);
        this.darkShadow = new IconBaseShadow(center, radius, radius * 1.05, 0.05);

        this.basePath = new paper.Path.Circle({
            center: center,
            radius: radius
        });
        this.basePath.strokeWidth = 0;
    }

    setColor(color) {
        this.basePath.fillColor = color;
    }

    setCenter(center) {
        this.basePath.center = center;
        this.lightShadow.setCenter(center);
        this.darkShadow.setCenter(center);
    }

    getPathWithoutShadows() {
        return this.basePath;
    }

    /**
     * Remove this base + shadow from canvas.
     */
    remove() {
        this.lightShadow.remove();
        this.darkShadow.remove();
        this.basePath.remove();
    }

}

module.exports = IconBase;
