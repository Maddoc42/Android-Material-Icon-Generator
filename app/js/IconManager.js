'use strict';

let paper = require('js/paper-core.min'),
    IconBase = require('js/IconBase'),
    Icon = require('js/Icon'),
    ColorPicker = require('js/ColorPicker'),
    paperScope = require('js/PaperScopeManager'),
    exportManager = require('js/ExportManager');

// Default android icon size (48 DIP)
const CANVAS_SIZE = 48;


/**
 * Handles adding icon + base.
 */
class IconManager {

    /**
     * @param canvas - jquery canvas object
     * @param containerEdit - jquery edit objects (can be multiple)
     * @param btnDownload - jquery download button
     * @param iconColorPicker - jquery icon color picker object
     * @param baseColorPicker - jquery base color picker object
     * @param sliderIconSize - jquery slider object for changing icon size
     * @param sliderShadowLength - jquery slider object for changing shadow length
     * @param sliderShadowIntensity - jquery slider object for changing shadow intensity
     * @param sliderShadowFading - jquery slider object for changing shadow fading
     * @param checkBoxCenterIcon - jquery check box object for centering the icon
     */
    constructor(canvas, containerEdit,
                btnDownload, iconColorPicker, baseColorPicker,
                sliderIconSize, sliderShadowLength, sliderShadowIntensity,
                sliderShadowFading, checkBoxCenterIcon) {

        this.canvas = canvas;
        this.containerEdit = containerEdit;
        this.iconColorPicker = iconColorPicker;
        this.baseColorPicker = baseColorPicker;
        this.sliderIconSize = sliderIconSize;
        this.sliderShadowLength = sliderShadowLength;
        this.sliderShadowIntensity = sliderShadowIntensity;
        this.sliderShadowFading = sliderShadowFading;

        // setup canvas
        paper.install(window);
        this.canvas.attr('height', canvas.height());
        this.canvas.attr('width', canvas.height());
        paperScope.setCanvases(this.canvas, containerEdit);
        paperScope.activateDraw();

        // place icon in center on canvas
        this.canvasSize = CANVAS_SIZE;
        paperScope.draw().view.center = new paper.Point(CANVAS_SIZE / 2, CANVAS_SIZE / 2);
        paperScope.draw().view.zoom = canvas.height() / CANVAS_SIZE;
        this.center = new paper.Point(this.canvasSize / 2, this.canvasSize / 2);

        // setup download
        btnDownload.click(function() {
            exportManager.createAndDownloadZip();
        }.bind(this));

        // setup center icon
        this.checkBoxCenterIcon = checkBoxCenterIcon;
        this.checkBoxCenterIcon.bootstrapToggle();
        this.checkBoxCenterIcon.change(function() {
            let checked = this.checkBoxCenterIcon.prop('checked');
            if (checked) this.icon.center();
        }.bind(this));
    }


    /**
     * Handles the svg file loaded callback.
     * @param svgData either raw svg data or a URL pointing to a svg file.
     */
    onSvgLoaded(svgData) {
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
        this.icon = new Icon(this.center, 'white', importedPath, this.iconBase, function() {
            let checked = this.checkBoxCenterIcon.prop('checked');
            if (checked) this.checkBoxCenterIcon.prop('checked', false).change();

        }.bind(this));
        this.icon.setSize(this.baseRadius * 2 * 0.60);

        // setup icon color picker
        new ColorPicker(this.iconColorPicker, defaultIconColor, function(newColor) {
            this.icon.setColor(newColor);
        }.bind(this));

        // setup shadow length slider
        let setShadowLengthFunction = function () {
            this.icon.getIconShadow().setLength(this.sliderShadowLengthData.getValue());
        }.bind(this);
        this.sliderShadowLengthData = this.sliderShadowLength.slider()
            .on('slide', function () {
                setShadowLengthFunction()
            }.bind(this))
            .data('slider');
        setShadowLengthFunction();

        // setup shadow intensity slider
        let setShadowIntensityFunction = function () {
            this.icon.getIconShadow().setIntensity(this.sliderShadowIntensityData.getValue());
        }.bind(this);
        this.sliderShadowIntensityData  = this.sliderShadowIntensity.slider()
            .on('slide', function () {
                setShadowIntensityFunction();
            }.bind(this))
            .data('slider');
        setShadowIntensityFunction();

        // setup shadow fading slider
        let setShadowFadingFunction = function () {
            this.icon.getIconShadow().setFading(this.sliderShadowFadingData.getValue());
        }.bind(this);
        this.sliderShadowFadingData = this.sliderShadowFading.slider()
            .on('slide', function () {
                setShadowFadingFunction();
            }.bind(this))
            .data('slider');
        setShadowFadingFunction();

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


    show() {
        this.containerEdit.show();
    }

}

module.exports = IconManager;