'use strict';

let paper = require('js/index/paper-core.min');


class ColorPicker {

    /**
     * @param colorPickerObject jquery color picker object
     * @param defaultColor initial color for this picker
     * @param onColorChangeCallback callback which will be called when color has changed.
     * Will receive a single param with a paper.Color object.
     */
    constructor(colorPickerObject, defaultColor, onColorChangeCallback) {
        colorPickerObject
            .colorpicker({
                customClass: 'colorpicker-2x',
                color: defaultColor,
                sliders: {
                    saturation: {
                        maxLeft: 200,
                        maxTop: 200
                    },
                    hue: {
                        maxTop: 200
                    },
                    alpha: {
                        maxTop: 200
                    }
                }
            })
            .on('changeColor.colorpicker', function (event) {
                let color = event.color.toRGB();
                onColorChangeCallback(new paper.Color(color.r / 255, color.g / 255, color.b / 255, color.a));
            }.bind(this));
    }

}


module.exports = ColorPicker;
