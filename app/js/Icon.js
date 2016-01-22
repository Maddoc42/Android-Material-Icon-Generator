'use strict';

let paper = require('js/paper-core.min'),
    IconShadow = require('js/IconShadow'),
    drawUtils = require('js/drawUtils');


class Icon {

    /**
     * @param position of this icon
     * @param color of this icon
     * @param iconPath of this icon
     * @param iconBase for this icon
     */
    constructor(position, color, iconPath, iconBase) {
        this.iconPath = iconPath;
        this.iconPath.position = position;
        this.iconPath.fillColor = color;
        this.iconShadow = new IconShadow(iconPath, iconBase);
        this.iconShadow.calculateShadow();
        this.size = Math.max(iconPath.bounds.width, iconPath.bounds.height);
    }


    /**
     * @param newSize absolute size in px which this icon should fit in (keeps aspect ratio)
     */
    setSize(newSize) {
        var scale = newSize / this.size;
        this.iconPath.scale(scale, this.iconPath.position);
        this.iconShadow.scale(scale);
        this.size = newSize;
    }


    /**
     * Remove this icon + shadow from the canvas.
     */
    remove() {
        this.iconPath.remove();
        this.iconShadow.remove();
    }

}

module.exports = Icon;
