'use strict';

let paper = require('js/index/paper-core.min'),
    IconShadow = require('js/index/IconShadow'),
    drawUtils = require('js/index/drawUtils'),
    paperScope = require('js/index/PaperScopeManager');


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
        this.size = Math.max(iconPath.bounds.width, iconPath.bounds.height);
        this.scale = 1;
        this.iconPath.moveAbove(iconBase.getPathWithoutShadows());
    }


    /**
     * @param newSize absolute size in px which this icon should fit in (keeps aspect ratio)
     */
    setSize(newSize) {
        let scale = newSize / this.size;
        this.iconPath.scale(scale, this.iconPath.position);
        this.iconShadow.scale(scale);
        this.size = newSize;
    }


    /**
     * Scales this icon + shadow without changing setting this.size. setScale(1) will rescale
     * this object to its original size.
     * @param newScale factor.
     */
    setScale(newScale) {
        this.iconPath.scale(newScale / this.scale, this.iconPath.position);
        this.iconShadow.scale(newScale / this.scale);
        this.scale = newScale;
        paperScope.draw().view.draw();
    }


    /**
     * Sets the color of this icon.
     * @param color paper.js compatible color value
     */
    setColor(color) {
        this.iconPath.fillColor = color;
        paperScope.draw().view.draw();
    }


    /**
     * Remove this icon + shadow from the canvas.
     */
    remove() {
        this.iconPath.remove();
        this.iconShadow.remove();
    }


    getIconShadow() {
        return this.iconShadow;
    }

}

module.exports = Icon;
