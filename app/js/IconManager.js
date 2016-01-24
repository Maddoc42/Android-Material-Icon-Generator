'use strict';

let paper = require('js/paper-core.min'),
    IconBase = require('js/IconBase'),
    Icon = require('js/Icon'),
    ColorPicker = require('js/ColorPicker');


/**
 * Handles adding icon + base.
 */
class IconManager {

    /**
     * @param canvas jquery canvas object
     * @param filePicker jquery input object
     * @param filePickerOverlay jquery input overlay object
     * @param btnDownload jquery download button
     * @param iconColorPicker jquery icon color picker object
     * @param baseColorPicker jquery base color picker object
     */
    constructor(canvas, filePicker, filePickerOverlay, btnDownload, iconColorPicker, baseColorPicker) {
        this.iconColorPicker = iconColorPicker;
        this.baseColorPicker = baseColorPicker;

        // hide canvas and forward overlay clicks
        canvas.hide();
        filePickerOverlay.click(function() {
            filePicker.click();
        });

        // setup drag / drop
        filePickerOverlay
            .on('drag dragstart dragend dragover dragenter dragleave drop', function (e) {
                e.preventDefault();
                e.stopPropagation();
            })
            .on('dragover dragenter', function() {
                filePickerOverlay.removeClass('filePickerOverlay-not-selected');
                filePickerOverlay.addClass('filePickerOverlay-selected');
            })
            .on('dragleave dragend', function() {
                filePickerOverlay.addClass('filePickerOverlay-not-selected');
                filePickerOverlay.removeClass('filePickerOverlay-selected');
            })
            .on('drop', function (e) {
                filePicker[0].files = e.originalEvent.dataTransfer.files;
            });

        // place icon in center on canvas
        this.canvasSize = canvas.width(); // assuming width = height
        this.center = new paper.Point(this.canvasSize / 2, this.canvasSize / 2);

        // setup file picker to import
        filePicker.change(function() {
            var svgFile = filePicker[0].files[0];
            if (!svgFile) return;

            // hide overlay and show canvas
            canvas.show();
            filePickerOverlay.hide();

            // read svg file
            var fileReader = new FileReader();
            fileReader.onload = function (event) {
                this.onSvgFileLoaded(event.target.result);
            }.bind(this);
            fileReader.readAsDataURL(svgFile);
        }.bind(this));

        // setup download
        btnDownload.click(function() {
            this.exportAsSvgFile();
        }.bind(this));
    }


    /**
     * Handles the svg file loaded callback.
     */
    onSvgFileLoaded(svgFileContent) {
        // remove any previous icons
        if (this.icon) this.icon.remove();

        paper.project.importSVG(svgFileContent, {
                applyMatrix: true,
                onLoad: function (importedItem) {
                    // check svg paths
                    let importedPath = this.getPathFromImport(importedItem);
                    if (!importedPath) {
                        window.alert('Sorry, no path found in SVG file :(');
                        return;
                    }
                    importedPath.strokeWidth = 0;

                    // one time base setup
                    this.setupBase();

                    // create icon and shadow
                    this.setupIcon(importedPath);

                }.bind(this)
            });
    }


    setupBase() {
        if (this.iconBase) return;

        let defaultBaseColor = '#512DA8';
        this.baseRadius = this.canvasSize / 2 * 0.9;
        this.iconBase = new IconBase(this.center, this.baseRadius);
        this.iconBase.setColor(defaultBaseColor);

        new ColorPicker(this.baseColorPicker, defaultBaseColor, function(newColor) {
            this.iconBase.setColor(newColor);
        }.bind(this));
    }


    setupIcon(importedPath) {
        let defaultIconColor = '#ffffff';
        this.icon = new Icon(this.center, 'white', importedPath, this.iconBase);
        this.icon.setSize(this.baseRadius * 2 * 0.60);
        this.icon.setColor(defaultIconColor);

        new ColorPicker(this.iconColorPicker, defaultIconColor, function(newColor) {
            this.icon.setColor(newColor);
        }.bind(this));
    }



    /**
     * Exports the whole project as one svg file.
     */
    exportAsSvgFile() {
        var svg = paper.project.exportSVG({ asString: true });
		var data = 'data:image/svg+xml;base64,' + btoa(svg);
		var fileName = 'icon.svg';

        var anchor = $('<a href="' + data + '" download="' + fileName + '">Download</a>')
            .css('display', 'none')
            .appendTo('body');
        anchor.get(0).click();
        anchor.remove();
    }


    getPathFromImport(importedItem) {
        // recursive search for paths in group
        if (importedItem instanceof paper.Group) {
            let possiblePaths = [];
            for (let i = 0; i < importedItem.children.length; ++i) {
                let path = this.getPathFromImport(importedItem.children[i]);
                if (path) possiblePaths.push(path);
            }

            // if only one path, return that one
            if (possiblePaths.length == 0) return null;
            if (possiblePaths.length == 1) return possiblePaths[0];

            // if multiple paths, try finding one with fill color
            // (helps importing Google material icons, which always have a second 'invisible' path)
            for (let i = 0; i < possiblePaths.length; ++i) {
                if (possiblePaths[i].fillColor) return possiblePaths[i];
            }
            // return first match
            return possiblePaths[0];
        }

        if (importedItem instanceof paper.PathItem) {
            return importedItem;
        }

        return null;
    }

}

module.exports = IconManager;
