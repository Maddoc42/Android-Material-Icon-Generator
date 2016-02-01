'use strict';

let paper = require('js/index/paper-core.min'),
    IconBase = require('js/index/IconBase'),
    Icon = require('js/index/Icon'),
    ColorPicker = require('js/index/ColorPicker'),
    paperScope = require('js/index/PaperScopeManager');


// Default android icon size (48 DIP)
const CANVAS_SIZE = 48;


/**
 * Handles adding icon + base.
 */
class IconManager {

    /**
     * @param canvas jquery canvas object
     * @param filePicker jquery input object
     * @param containerEdit jquery edit objects (can be multiple)
     * @param btnDownload jquery download button
     * @param iconColorPicker jquery icon color picker object
     * @param baseColorPicker jquery base color picker object
     * @param sliderShadow jquery slider object for changing shadow intensity
     * @param sliderIconSize jquery slider object for changing icon size
     */
    constructor(canvas, filePicker, containerEdit,
                btnDownload, iconColorPicker, baseColorPicker, sliderShadow,
                sliderIconSize) {

        this.canvas = canvas;
        this.filePicker = filePicker;
        this.containerEdit = containerEdit;
        this.iconColorPicker = iconColorPicker;
        this.baseColorPicker = baseColorPicker;
        this.sliderShadow = sliderShadow;
        this.sliderIconSize = sliderIconSize;

        // hide canvas and forward overlay clicks
        canvas.hide();

        // place icon in center on canvas
        this.canvasSize = CANVAS_SIZE;
        paperScope.draw().view.center = new paper.Point(CANVAS_SIZE / 2, CANVAS_SIZE / 2);
        paperScope.draw().view.zoom = canvas.width() / CANVAS_SIZE;
        this.center = new paper.Point(this.canvasSize / 2, this.canvasSize / 2);

        filePicker.setSvgLoadedCallback(function(svgData) {
            this.onSvgFileLoaded(svgData);
        }.bind(this));

        // setup download
        btnDownload.click(function() {
            this.exportAsSvgFile();
        }.bind(this));
    }


    /**
     * Handles the svg file loaded callback.
     * @param svgData either raw svg data or a URL pointing to a svg file.
     */
    onSvgFileLoaded(svgData) {
        // remove any previous icons
        if (this.icon) this.icon.remove();

        paperScope.draw().project.importSVG(svgData, {
            applyMatrix: true,
            expandShapes: true,
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
        let defaultBaseColor = '#512DA8';
        this.baseRadius = this.canvasSize / 2 * 0.9;
        this.iconBase = new IconBase(this.center, this.baseRadius);
        this.iconBase.setColor(defaultBaseColor);

        new ColorPicker(this.baseColorPicker, defaultBaseColor, function(newColor) {
            this.iconBase.setColor(newColor);
        }.bind(this));
    }


    setupIcon(importedPath) {
        // create icon + shadow
        let defaultIconColor = '#ffffff';
        this.icon = new Icon(this.center, 'white', importedPath, this.iconBase);
        this.icon.setSize(this.baseRadius * 2 * 0.60);

        // setup icon color picker
        new ColorPicker(this.iconColorPicker, defaultIconColor, function(newColor) {
            this.icon.setColor(newColor);
        }.bind(this));

        // setup shadow intensity picker
        let setIntensityFunction = function() {
            let intensity = this.sliderShadowData.getValue();
            this.icon.getIconShadow().setIntensity(intensity[1], intensity[0]);
        }.bind(this);
        this.sliderShadowData = this.sliderShadow.slider()
            .on('slide', function () {
                setIntensityFunction();
            }.bind(this))
            .data('slider');
        setIntensityFunction();

        // setup icon size picker
        let setSizeFunction = function () {
            let size = this.sliderIconSizeData.getValue();
            let scale = 0.0954548 * Math.exp(0.465169 * size);
            this.icon.setScale(scale);
        }.bind(this);
        this.sliderIconSizeData = this.sliderIconSize.slider()
            .on('slide', function () {
                setSizeFunction();
            }.bind(this))
            .data('slider');
        this.icon.getIconShadow().applyShadow();

        // show canvas + remove loading msg
        this.filePicker.hide(300);
        this.canvas.delay(300).fadeIn(300);
        this.containerEdit.delay(300).fadeIn(300);
    }



    /**
     * Exports the whole project as one svg file.
     */
    exportAsSvgFile() {
        paperScope.activateExpo();
        let drawProject = paperScope.draw().project;
        let exportProject = paperScope.expo().project;

        // copy draw layer over to export canvas
        exportProject.clear();
        let layer = new paper.Layer();
        for (let i = 0; i < drawProject.layers[0].children.length; ++i) {
            layer.addChild(drawProject.layers[0].children[i].clone(false));
        }

        // generate final svg
        var svg = exportProject.exportSVG({ asString: true });
		var data = 'data:image/svg+xml;base64,' + btoa(svg);
		var fileName = 'icon.svg';

        // create download link
        var anchor = $('<a href="' + data + '" download="' + fileName + '">Download</a>')
            .css('display', 'none')
            .appendTo('body');
        anchor.get(0).click();
        anchor.remove();

        // reactivate draw scope
        paperScope.activateDraw();
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

            // if multiple paths, select all with fill color
            // (helps importing Google material icons, which always have a second 'invisible' path)
            let filledPaths = [];
            for (let i = 0; i < possiblePaths.length; ++i) {
                let path = possiblePaths[i];
                if (path.fillColor) filledPaths.push(possiblePaths[i]);
                path.remove();
            }

            // create new CompoundPath from single paths
            let simplePaths = [];
            for (let i = 0; i < filledPaths.length; ++i) {
                let path = filledPaths[i];
                if (path instanceof paper.Path) {
                    simplePaths.push(path);
                } else if (path instanceof paper.CompoundPath) {
                    for (let j = 0; j < path.children.length; ++j) {
                        simplePaths.push(path.children[j]);
                    }
                }
                simplePaths[simplePaths.length - 1].fillColor = new paper.Color(0, 0, 0, 0);
            }
            // sorting paths by area seems to be necessary to properly determine inside / outside of paths
            // (yes, it shouldn't, but ic_child_care_* seems to do just this)
            simplePaths.sort(function(a , b) {
                return a.area - b.area;
            });
            return new paper.CompoundPath({ children: simplePaths });
        }

        if (importedItem instanceof paper.PathItem) {
            return importedItem;
        }

        return null;
    }

}

module.exports = IconManager;
