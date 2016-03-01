'use strict';


/**
 * Handles loading svg files.
 */
class InputManager {

    /**
     * @param containerInput - jquery object holding all input elements
     * @param selectedIconName - optional param which points to one of the Google material icons.
     */
    constructor(containerInput, selectedIconName) {
        this.containerInput = containerInput;
        this.selectedIconName = selectedIconName;
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
        return;

        /*
        let iconsContainer = this.containerInput.find('#container-icon-picker-icons');
        console.log(iconsContainer);
        let categoryTemplate = this.containerInput.find('#template-category');
        console.log(categoryTemplate);
        let hrTemplate = this.containerInput.find('#template-hr');
        console.log(hrTemplate);
        let iconTemplate = this.containerInput.find('#template-icon');
        console.log(iconTemplate);

        for (let i = 0; i < materialIcons.length; ++i) {
            console.log('adding icon');
            // add hr
            if (i != 0) {
                let hr = hrTemplate.clone();
                hr.removeAttr('id');
                iconsContainer.append(hr);
            }

            let category = materialIcons[i];

            // create + append category
            let categoryDiv = categoryTemplate.clone();
            categoryDiv.removeAttr('id');
            iconsContainer.append(categoryDiv);

            // set category data
            let categoryName = category.category;
            let fileNames = category.fileNames;
            categoryDiv.find('h2').html(categoryName);

            for (let j = 0; j < fileNames.length; ++j) {
                let fileName = fileNames[j];

                // create + append icon
                let iconDiv = iconTemplate.clone();
                iconDiv.removeAttr('id');
                categoryDiv.append(iconDiv);

                // set icon
                let img = iconDiv.find('img');
                img.attr('src', '../material-icons/' + categoryName + '/' + fileName);

                // set icon name fileName
                let iconName = fileName.replace('ic_', '').replace('_48px.svg', '').replace(new RegExp('_', 'g'), ' ');
                iconDiv.find('.icon-title').html(iconName);

                // set link
                iconDiv.find('.container-icon-anchor').attr('href', '../?icon=' + 'material-icons/' + categoryName + '/' + fileName);
            }
        }
        */
    }

    /**
     * @param callback which will be called when the local (!) svg file has finished loading.
     * Svg data is passed as a parameter.
     */
    setSvgLoadedCallback(callback) {
        this.onSvgLoaded = callback;
        if (this.selectedIconName) {
            callback(this.selectedIconName);
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
