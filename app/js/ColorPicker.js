'use strict';


class ColorPicker {

    /**
     * @param colorPickerObject jquery color picker object
     * @param defaultColor initial color for this picker
     * @param onColorChangeCallback callback which will be called when color has changed.
     */
    constructor(colorPickerObject, defaultColor, onColorChangeCallback) {
        colorPickerObject
            .colorpicker({
                color: defaultColor,
                align: 'left'
            })
            .on('changeColor.colorpicker', function () {
                onColorChangeCallback(this.getColor());
            }.bind(this));
        this.colorPickerObject = colorPickerObject;
    }


    /**
     * @returns the paper.js color object currently selected by this picker.
     */
    getColor() {
        let pickerColor = this.colorPickerObject.data('colorpicker').color.toRGB();
        return new paper.Color(
            pickerColor.r / 255,
            pickerColor.g / 255,
            pickerColor.b / 255,
            pickerColor.a
        );
    }


}


module.exports = ColorPicker;
