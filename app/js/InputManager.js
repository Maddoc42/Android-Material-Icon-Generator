'use strict';


/**
 * Handles loading svg files.
 */
class InputManager {

    /**
     * @param containerInput - jquery object holding all input elements
     */
    constructor(containerInput) {
        this.containerInput = containerInput;
        this.setupFilePicker();
        this.setupIconPicker();
    }


    setupFilePicker() {
        let overlay = this.containerInput.find('#file-picker-overlay');
        let input = this.containerInput.find('#file-picker-input');

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
                overlay.parent().addClass('container-file-picker-hovered');
            })
            .on('dragleave dragend', function() {
                overlay.parent().removeClass('container-file-picker-hovered');
            })
            .on('drop', function (e) {
                input[0].files = e.originalEvent.dataTransfer.files;
            });

        // setup file picker to import
        input.change(function() {
            var svgFile = input[0].files[0];
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


    setupIconPicker() {
        // setup click to start editing
        let instanceThis = this;
        this.containerInput.find('#container-icon-picker .container-icon-anchor').each(function() {
            let icon = $(this);
            icon.click(function() {
                let category = icon.attr('data-icon-category');
                let iconName = icon.attr('data-icon-name');
                let iconFileName = 'img/material-icons/' + category + '/ic_' + iconName + '_48px.svg';
                instanceThis.onSvgLoaded(iconFileName);
            });
        });

        // setup smooth scrolling
        let containerInput = this.containerInput;
        $('a').click(function () {
            let scrollContent = containerInput.find('.simplebar-scroll-content');
            scrollContent.animate({
                scrollTop: $($.attr(this, 'href')).offset().top
            }, 700, 'swing');
            return false;
        });
    }


    /**
     * @param callback which will be called when the local (!) svg file has finished loading.
     * Svg data is passed as a parameter.
     */
    setSvgLoadedCallback(callback) {
        this.onSvgLoaded = callback;
    }


    /**
     * Hides all input UI.
     */
    hide() {
        this.containerInput.css('top', this.containerInput.css('height'));
    }


    /**
     * Shows all input UI.
     */
    show() {
        this.containerInput.css('top', 0);
    }

}

module.exports = InputManager;
