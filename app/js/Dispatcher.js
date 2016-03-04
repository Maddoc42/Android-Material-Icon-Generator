'use strict';


/**
 * Handles transitions between various windows.
 */
class Dispatcher {

    /**
     * @param inputManager
     * @param iconManager
     * @param {string} preselectedIconUrl - A url pointing to a svg
     * resource located on the server which should be loaded directly.
     * Optional
     */
    constructor(inputManager, iconManager, preselectedIconUrl) {
        this.inputManager = inputManager;
        this.iconManager = iconManager;

        if (preselectedIconUrl) {
            console.log('icon preselected');
            this.showIcon(preselectedIconUrl);
        } else {
            this.inputManager.setSvgLoadedCallback(function(svgData) {
                console.log('svg loaded');
                this.showIcon(svgData);
            }.bind(this));
        }
    }


    showIcon(svgData) {
        this.inputManager.hide();
        this.iconManager.show();
        setTimeout(function() {
            this.iconManager.onSvgLoaded(svgData);
        }.bind(this), 500);
    }


    hideIcon() {
        this.iconManager.hide();
        this.inputManager.show();
    }

}

module.exports = Dispatcher;
