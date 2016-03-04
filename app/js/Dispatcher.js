'use strict';

const TRANSITION_TIME = 500; // ms, time between input / icon windows


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
        setTimeout(function() {
            this.iconManager.onSvgLoaded(svgData);
        }.bind(this), TRANSITION_TIME);
    }


    hideIcon() {
        this.inputManager.show();
        setTimeout(function() {
            this.iconManager.hide();
        }.bind(this), TRANSITION_TIME);
    }

}

module.exports = Dispatcher;
