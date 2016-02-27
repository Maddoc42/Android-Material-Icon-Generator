'use strict';


/**
 * Handles loading svg files.
 */
class InputManager {

    /**
     * @param containerInput - jquery object holding all input elements
     * @param fileInput - jquery input object
     * @param overlay - jquery overlay which should be hidden when finished loading
     * @param contentLoading - jquery loading msg
     * @param iconName - optional param which points to one of the Google material icons.
     */
    constructor(containerInput, fileInput, overlay, iconName) {
        this.containerInput = containerInput;
        this.iconName = iconName;

        overlay.click(function() {
            fileInput.click();
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
                fileInput[0].files = e.originalEvent.dataTransfer.files;
            });

        // setup file picker to import
        fileInput.change(function() {
            var svgFile = fileInput[0].files[0];
            if (!svgFile) return;

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
        if (this.iconName) {
            callback(this.iconName);
        }
    }


    /**
     * Hides all input UI.
     */
    hide() {
        this.containerInput.css('top', this.containerInput.css('height'));
    }

}

module.exports = InputManager;
