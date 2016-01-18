'use strict';

var paper = require('js/paper-core.min');


class IconBackgroundShadow {

    /**
     * @param center of this background relative to the underlying canvas
     * @param baseRadius radius of the icon base
     * @param shadowRadius radius of the icon base shadow
     * @param shadowAlpha starting alpha value of this shadow (1 - 0, where 0 is no shadow and 1 is black)
     */
    constructor(center, baseRadius, shadowRadius, shadowAlpha) {
        // shadow object
        this.shadow = new paper.Path.Circle({
            center: center,
            radius: shadowRadius
        });

        // shadow fill color
        this.shadow.fillColor = {
            gradient: {
                stops: [[new paper.Color(0, 0, 0, shadowAlpha), baseRadius / shadowRadius], [new paper.Color(0, 0, 0, 0), 1]],
                radial: true
            },
            origin: this.shadow.position,
            destination: this.shadow.bounds.rightCenter
        }
    }

    setCenter(center) {
        this.shadow.center = center;
    }

}

module.exports = IconBackgroundShadow;
