'use strict';

let paper = require('js/paper-core.min'),
    IconShadow = require('js/IconShadow');


class Icon {

    /**
     * @param center of this icon
     * @param color of this icon
     * @param iconPath of this icon
     * @param iconBase for this icon
     */
    constructor(center, color, iconPath, iconBase) {
        this.iconPath = iconPath;
        this.iconPath.position = center;
        this.iconPath.fillColor = color;
        this.iconShadow = new IconShadow(iconPath, iconBase);
        this.iconShadow.calculateShadow();
    }

}

module.exports = Icon;
