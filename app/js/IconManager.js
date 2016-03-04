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
        this.btnDownload = btnDownload;
        this.checkBoxCenterIcon = checkBoxCenterIcon;

        this.initCanvas();
        this.initControls();

    }


    /**
     * Initial canvas setup.
     */
    initCanvas() {
        // setup canvas
        paper.install(window);
        let canvasHeight = this.canvas.height();
        this.canvas.attr('height', canvasHeight);
        this.canvas.attr('width', canvasHeight);
        paperScope.setCanvases(this.canvas, this.containerEdit);
        paperScope.activateDraw();

        // place icon in center on canvas
        this.canvasSize = CANVAS_SIZE;
        paperScope.draw().view.center = new paper.Point(CANVAS_SIZE / 2, CANVAS_SIZE / 2);
        paperScope.draw().view.zoom = canvasHeight / CANVAS_SIZE;
        this.center = new paper.Point(this.canvasSize / 2, this.canvasSize / 2);
    }


    /**
     * Initial controls setup.
     */
    initControls() {
        // setup base color picker
        let defaultBaseColor = '#512DA8';
        this.setIconBaseColorFunction = function() {
            this.iconBase.setColor(this.baseColorPicker.getColor());
        }.bind(this);
        this.baseColorPicker = new ColorPicker(this.baseColorPicker, defaultBaseColor, this.setIconBaseColorFunction);

        // setup icon color picker
        let defaultIconColor = '#ffffff';
        this.setIconColorFunction = function () {
            this.icon.setColor(this.iconColorPicker.getColor());
        }.bind(this);
        this.iconColorPicker = new ColorPicker(this.iconColorPicker, defaultIconColor, this.setIconColorFunction);

        // setup shadow length slider
        this.setShadowLengthFunction = function () {
            this.icon.getIconShadow().setLength(this.sliderShadowLengthData.getValue());
        }.bind(this);
        this.sliderShadowLengthData = this.sliderShadowLength.slider()
            .on('slide', this.setShadowLengthFunction)
            .data('slider');

        // setup shadow intensity slider
        this.setShadowIntensityFunction = function () {
            this.icon.getIconShadow().setIntensity(this.sliderShadowIntensityData.getValue());
        }.bind(this);
        this.sliderShadowIntensityData  = this.sliderShadowIntensity.slider()
            .on('slide', this.setShadowIntensityFunction)
            .data('slider');

        // setup shadow fading slider
        this.setShadowFadingFunction = function () {
            this.icon.getIconShadow().setFading(this.sliderShadowFadingData.getValue());
        }.bind(this);
        this.sliderShadowFadingData = this.sliderShadowFading.slider()
            .on('slide', this.setShadowFadingFunction)
            .data('slider');

        // setup icon size picker
        this.setSizeFunction = function () {
            let size = this.sliderIconSizeData.getValue();
            let scale = 0.0954548 * Math.exp(0.465169 * size);
            this.icon.setScale(scale);
        }.bind(this);
        this.sliderIconSizeData = this.sliderIconSize.slider()
            .on('slide', this.setSizeFunction)
            .data('slider');

        // setup center icon
        this.checkBoxCenterIcon.bootstrapToggle();
        this.checkBoxCenterIcon.change(function() {
            let checked = this.checkBoxCenterIcon.prop('checked');
            if (checked) this.icon.center();
        }.bind(this));

        // setup download
        this.btnDownload.click(function() {
            exportManager.createAndDownloadZip();
        }.bind(this));
    }


    /**
     * Handles the svg file loaded callback.
     * @param svgData either raw svg data or a URL pointing to a svg file.
     */
    onSvgLoaded(svgData) {
        // remove any previous icons
        if (this.icon) this.icon.remove();
        if (this.iconBase) this.iconBase.remove();

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
        this.baseRadius = this.canvasSize / 2 * 0.9;
        this.iconBase = new IconBase(this.center, this.baseRadius);

        // set default values
        this.setIconBaseColorFunction();
    }


    setupIcon(importedPath) {
        // create icon + shadow
        this.icon = new Icon(this.center, importedPath, this.iconBase, function() {
            let checked = this.checkBoxCenterIcon.prop('checked');
            if (checked) this.checkBoxCenterIcon.prop('checked', false).change();
        }.bind(this));

        // set default icon values
        this.icon.setSize(this.baseRadius * 2 * 0.60);
        this.setIconColorFunction();
        this.setShadowLengthFunction();
        this.setShadowIntensityFunction();
        this.setShadowFadingFunction();
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

    hide() {
        // nothing to do for now
    }

}

module.exports = IconManager;