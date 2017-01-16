'use strict';

let IconBase = require('js/IconBase'),
    Icon = require('js/Icon'),
    ColorPicker = require('js/ColorPicker'),
    paperScope = require('js/PaperScopeManager'),
    exportManager = require('js/ExportManager'),
    errors = require('js/errors'),
    gaConstants = require('js/gaConstants'),
    Banner = require('js/Banner');

// Default android icon size (48 DIP)
const
    CANVAS_SIZE = 48,
    BASE_RADIUS = 21;



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
                sliderShadowFading, checkBoxCenterIcon, bannerColorPicker,
                bannerTextColorPicker) {

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
        this.bannerColorPicker = bannerColorPicker;
        this.bannerTextColorPicker = bannerTextColorPicker;
        this.loadingOverlay = this.containerEdit.find('#canvas-loading');

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
        this.setIconBaseColorFunction = function(event, disableDraw) {
            this.iconBase.setColor(this.baseColorPicker.getColor());
            if (!disableDraw) {
                ga('send', 'event', gaConstants.CATEGORY_EDITOR, gaConstants.ACTION_CHANGE_BASE_COLOR);
                paperScope.draw().view.draw();
            }
        }.bind(this);
        this.baseColorPicker = new ColorPicker(this.baseColorPicker, defaultBaseColor, this.setIconBaseColorFunction);

        // setup icon color picker
        let defaultIconColor = '#ffffff';
        this.setIconColorFunction = function (event, disableDraw) {
            this.icon.setColor(this.iconColorPicker.getColor());
            if (!disableDraw) {
                ga('send', 'event', gaConstants.CATEGORY_EDITOR, gaConstants.ACTION_CHANGE_ICON_COLOR);
                paperScope.draw().view.draw();
            }
        }.bind(this);
        this.iconColorPicker = new ColorPicker(this.iconColorPicker, defaultIconColor, this.setIconColorFunction);

        // setup shadow length slider
        this.setShadowLengthFunction = function (event, disableDraw) {
            this.icon.getIconShadow().setLength(this.sliderShadowLengthData.getValue());
            if (!disableDraw) {
                ga('send', 'event', gaConstants.CATEGORY_EDITOR, gaConstants.ACTION_CHANGE_SHADOW_LENGTH);
                paperScope.draw().view.draw();
            }
        }.bind(this);
        this.sliderShadowLengthData = this.sliderShadowLength.slider()
            .on('slide', this.setShadowLengthFunction)
            .data('slider');

        // setup shadow intensity slider
        this.setShadowIntensityFunction = function (event, disableDraw) {
            this.icon.getIconShadow().setIntensity(this.sliderShadowIntensityData.getValue());
            if (!disableDraw) {
                ga('send', 'event', gaConstants.CATEGORY_EDITOR, gaConstants.ACTION_CHANGE_SHADOW_INTENSITY);
                paperScope.draw().view.draw();
            }
        }.bind(this);
        this.sliderShadowIntensityData  = this.sliderShadowIntensity.slider()
            .on('slide', this.setShadowIntensityFunction)
            .data('slider');

        // setup shadow fading slider
        this.setShadowFadingFunction = function (event, disableDraw) {
            this.icon.getIconShadow().setFading(this.sliderShadowFadingData.getValue());
            if (!disableDraw) {
                ga('send', 'event', gaConstants.CATEGORY_EDITOR, gaConstants.ACTION_CHANGE_SHADOW_FADING);
                paperScope.draw().view.draw();
            }
        }.bind(this);
        this.sliderShadowFadingData = this.sliderShadowFading.slider()
            .on('slide', this.setShadowFadingFunction)
            .data('slider');

        // setup icon size picker
        this.setSizeFunction = function (event, disableDraw) {
            let size = this.sliderIconSizeData.getValue();
            let scale = 0.0954548 * Math.exp(0.465169 * size);
            this.icon.setScale(scale);
            if (!disableDraw) {
                ga('send', 'event', gaConstants.CATEGORY_EDITOR, gaConstants.ACTION_CHANGE_ICON_SIZE);
                paperScope.draw().view.draw();
            }
        }.bind(this);
        this.sliderIconSizeData = this.sliderIconSize.slider()
            .on('slide', this.setSizeFunction)
            .data('slider');

        // setup center icon
        this.checkBoxCenterIcon.bootstrapToggle();
        this.checkBoxCenterIcon.change(function() {
            let checked = this.checkBoxCenterIcon.prop('checked');
            if (checked) this.icon.center();
            paperScope.draw().view.draw();
            ga('send', 'event', gaConstants.CATEGORY_EDITOR, gaConstants.ACTION_CHANGE_CENTER_ICON);
        }.bind(this));

        // setup base shape button
        let baseShapePicker = this.containerEdit.find('#base-shape input[name="radio-base-shape"]');
        this.setIconBaseShapeFunction = function(event, disableDraw) {
            let setCircularShape = this.containerEdit.find('#base-shape-circle')[0].checked === true;
            if (setCircularShape) {
                this.iconBase.setCircularShape();
            } else {
                this.iconBase.setSquareShape();
            }
            if (this.icon) {
                ga('send', 'event', gaConstants.CATEGORY_EDITOR, gaConstants.ACTION_CHANGE_BASE_SHAPE, setCircularShape ? 'circular' : 'square');
                this.icon.applyIcon();
                this.icon.getIconShadow().applyShadow();
            }
            if (!disableDraw) paperScope.draw().view.draw();
        }.bind(this);
        baseShapePicker.change(this.setIconBaseShapeFunction);

        // setup banner container controller
        let bannerPicker = this.containerEdit.find('#banner input[name="radio-banner"]');
        let bannerCollapsibleContainer = this.containerEdit.find('#banner-collapsible-container');
        this.setBannerFunction = function(event, disableDraw) {
            let enableBeta = this.containerEdit.find('#banner-beta')[0].checked === true;
            let enableDev  = this.containerEdit.find('#banner-dev')[0].checked === true;
            if (enableBeta || enableDev) {
                bannerCollapsibleContainer.css('max-height', '1000px');
            } else {
                this.banner.hide();
                bannerCollapsibleContainer.css('max-height', '0');
            }
            if (enableBeta) this.banner.showBeta();
            else if (enableDev) this.banner.showDev();
            if (this.icon) {
                ga('send', 'event', gaConstants.CATEGORY_EDITOR, gaConstants.ACTION_CHANGE_BANNER_VALUE, enableBeta || enableDev ? (enableBeta ? 'beta' : 'dev' ) : 'none');
            }
            if (!disableDraw) paperScope.draw().view.draw();
        }.bind(this);
        bannerPicker.change(this.setBannerFunction);

        // setup banner background color
        let defaultBannerBackgroundColor = '#404041';
        this.setBannerBackgroundColorFunction = function(event, disableDraw) {
            this.banner.setBackgroundColor(this.bannerColorPicker.getColor());
            if (!disableDraw) {
                ga('send', 'event', gaConstants.CATEGORY_EDITOR, gaConstants.ACTION_CHANGE_BANNER_BACKGROUND_COLOR);
                paperScope.draw().view.draw();
            }
        }.bind(this);
        this.bannerColorPicker = new ColorPicker(this.bannerColorPicker, defaultBannerBackgroundColor, this.setBannerBackgroundColorFunction);

        // setup banner text color
        let defaultBannerTextColor = '#ffffff';
        this.setBannerTextColorFunction = function(event, disableDraw) {
            this.banner.setTextColor(this.bannerTextColorPicker.getColor());
            if (!disableDraw) {
                ga('send', 'event', gaConstants.CATEGORY_EDITOR, gaConstants.ACTION_CHANGE_BANNER_TEXT_COLOR);
                paperScope.draw().view.draw();
            }
        }.bind(this);
        this.bannerTextColorPicker = new ColorPicker(this.bannerTextColorPicker, defaultBannerTextColor, this.setBannerTextColorFunction);

        // setup download
        this.btnDownload.click(function() {
            ga('send', 'event', gaConstants.CATEGORY_EDITOR, gaConstants.ACTION_DOWNLOAD);
            exportManager.createAndDownloadZip();
        }.bind(this));
    }


    /**
     * @param {function} errorCallback - will be called if there was an error processing the svg file.
     * Callback has a single argument, the error code.
     */
    setErrorCallback(errorCallback) {
        this.errorCallback = errorCallback;
    }


    /**
     * Handles the svg file loaded callback.
     * @param svgData either raw svg data or a URL pointing to a svg file.
     */
    onSvgLoaded(svgData) {
        console.log('Loaded svg file: ' + svgData);

        // remove any previous icons
        if (this.icon) this.icon.remove();
        if (this.iconBase) this.iconBase.remove();
        if (this.banner) {
          this.banner.remove();
          let bannerCollapseController = this.containerEdit.find("#banner-controller");
          bannerCollapseController.prop("checked", false).change();
        }

        this.loadingSvg = true;
        paperScope.draw().project.importSVG(svgData, {
            applyMatrix: true,
            expandShapes: true,
            onLoad: function (importedItem) {
                console.log('Imported svg data: ' + importedItem);

                if (!this.loadingSvg) return;
                this.loadingSvg = false; // on error callback is fired twice. This flag stops that

                // valid svg file?
                if (!importedItem) {
                    this.errorCallback(errors.ERROR_INVALID_SVG_FILE);
                    return;
                }

                // check svg paths
                let importedPath = this.getPathFromImport(importedItem);
                if (!importedPath) {
                    this.errorCallback(errors.ERROR_NO_PATH_FOUND);
                    return;
                }
                if (!this.isClosedPath(importedPath)) {
                    this.errorCallback(errors.ERROR_OPEN_PATHS);
                }
                importedPath.strokeWidth = 0;

                // one time base setup
                this.setupBase();

                // create icon and shadow
                this.setupIcon(importedPath);

                // create banner
                this.setupBanner();

                this.loadingOverlay.css('opacity', 0);
                this.canvas.css('opacity', 1);
                setTimeout(function() {
                    this.loadingOverlay.hide();
                }.bind(this), 500);

            }.bind(this)
        });
    }


    setupBase() {
        this.iconBase = new IconBase(this.center, BASE_RADIUS);

        // set default values
        this.setIconBaseColorFunction(null, true);
        this.setIconBaseShapeFunction(null, true);
    }

    setupBanner(){
        this.banner = new Banner();

        // set default values
        this.setBannerFunction(null, true);
        this.setBannerBackgroundColorFunction(null, true);
        this.setBannerTextColorFunction(null, true);
    }

    setupIcon(importedPath) {
        // create icon + shadow
        this.icon = new Icon(this.center, importedPath, this.iconBase, function() {
            let checked = this.checkBoxCenterIcon.prop('checked');
            if (checked) this.checkBoxCenterIcon.prop('checked', false).change();
        }.bind(this));

        // set default icon values
        this.icon.setSize(BASE_RADIUS * 2 * 0.60);
        this.setSizeFunction(null, true);
        this.setIconColorFunction(null, true);
        this.setShadowLengthFunction(null, true);
        this.setShadowIntensityFunction(null, true);
        this.setShadowFadingFunction(null, true);
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

            if (filledPaths.length === 0) return null;

            let result = filledPaths[0];
            for (let i = 0; i < filledPaths.length; ++i) {
                result = result.unite(filledPaths[i]);
            }
            result.fillColor = filledPaths[0].fillColor;
            return result;

        } else if (importedItem instanceof paper.PathItem) {
            return importedItem;

        } else if (importedItem instanceof paper.Shape) {
            let convertedPath = importedItem.toPath(true);
            convertedPath.fillColor = importedItem.fillColor;
            importedItem.remove();
            return this.getPathFromImport(convertedPath);
        }

        return null;
    }

    /**
     * Returns true if the path / compound path is closed, false otherwise.
     */
    isClosedPath(path) {
        if (path instanceof paper.Path) return path.closed;
        else if (path instanceof paper.CompoundPath) {
            for (let i = 0; i < path.children.length; ++i) {
                if (!this.isClosedPath(path.children[i])) return false;
            }
            return true;
        }
        return false;
    }


    show() {
        this.containerEdit.css('opacity', 1);
        this.containerEdit.css('visibility', 'visible');
        $('html').css({
            height: '100%',
            overflow: 'hidden',
        });
    }

    hide() {
        $('html').css({
            height: 'auto',
            overflow: 'auto',
        });
        this.containerEdit.css('opacity', 0);
        setTimeout(() => {
            this.containerEdit.css('visibility', 'hidden');
            this.canvas.css('opacity', 0);
            this.loadingOverlay.show();
            this.loadingOverlay.css('opacity', 1);
        }, 500);
    }

}

module.exports = IconManager;
