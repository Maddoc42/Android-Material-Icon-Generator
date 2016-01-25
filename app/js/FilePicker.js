'use strict';


/**
 * Handles loading svg files.
 */
class FilePicker {

    /**
     * @param input jquery input object
     * @param overlay jquery overlay which should be hidden when finished loading
     * @param contentDescription jquery initial description
     * @param contentLoading jquery loading msg
     */
    constructor(input, overlay, contentDescription, contentLoading) {
        this.overlay = overlay;

        overlay.click(function() {
            input.click();
        });

        // setup drag / drop
        overlay
            .on('drag dragstart dragend dragover dragenter dragleave drop', function (e) {
                e.preventDefault();
                e.stopPropagation();
            })
            .on('dragover dragenter', function() {
                overlay.removeClass('filePickerOverlay-not-selected');
                overlay.addClass('filePickerOverlay-selected');
            })
            .on('dragleave dragend', function() {
                overlay.addClass('filePickerOverlay-not-selected');
                overlay.removeClass('filePickerOverlay-selected');
            })
            .on('drop', function (e) {
                input[0].files = e.originalEvent.dataTransfer.files;
            });

        // setup file picker to import
        input.change(function() {
            var svgFile = input[0].files[0];
            if (!svgFile) return;

            contentDescription.hide();
            contentLoading.css('opacity', 1);

            // read svg file
            var fileReader = new FileReader();
            fileReader.onload = function (event) {
                if (!this.onSvgLoaded) return;
                this.onSvgLoaded(event.target.result);
            }.bind(this);
            fileReader.readAsDataURL(svgFile);
        }.bind(this));
    }


    /**
     * @param callback which will be called when the local (!) svg file has finished loading.
     * Svg data is passed as a parameter.
     */
    setSvgLoadedCallback(callback) {
        this.onSvgLoaded = callback;
    }


    /**
     * Hides the complete file picker.
     */
    hide() {
        this.overlay.hide();
    }

}

module.exports = FilePicker;
