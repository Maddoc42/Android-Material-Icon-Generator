'use strict';

let gaConstants = require('js/gaConstants');

const TRANSITION_TIME = 500; // ms, time between input / icon windows

const
    PAGE_INPUT = 0,
    PAGE_EDITOR = 1;


/**
 * Handles transitions between various windows.
 */
class Dispatcher {

    /**
     * @param inputManager
     * @param iconManager
     * @param errorManager
     * @param {string} preselectedIconUrl - A url pointing to a svg
     * resource located on the server which should be loaded directly.
     * Optional
     */
    constructor(inputManager, iconManager, errorManager, preselectedIconUrl) {
        this.inputManager = inputManager;
        this.iconManager = iconManager;
        this.errorManager = errorManager;

        this.inputManager.setSvgLoadedCallback(function(svgData) {
            this.showEditor(svgData);
        }.bind(this));

        // setup svg loading
        if (preselectedIconUrl) {
            this.showEditor(preselectedIconUrl);
        } else {
            this.inputManager.setSvgLoadedCallback(function(svgData) {
                this.showEditor(svgData);
            }.bind(this));
        }

        // setup error handling
        this.iconManager.setErrorCallback(function(error) {
            ga('send', 'event', gaConstants.CATEGORY_INPUT, gaConstants.ACTION_ERROR, error.title);
            this.errorManager.show(error);
        }.bind(this));
        this.errorManager.setDismissCallback(function() {
            window.history.back();
        });

        // handle browser back button
        window.history.pushState({currentPage: PAGE_INPUT}, '', '');
        window.onpopstate = function(event) {
            let page = event && event.state && event.state.currentPage;
            if (page === PAGE_INPUT) {
                ga('send', 'event', gaConstants.CATEGORY_EDITOR, gaConstants.ACTION_BACK);
                if (errorManager.isVisible()) errorManager.hide();
                this.showInput();
                return;
            }

            if (location.href.indexOf('#') >= 0) {
                window.history.replaceState({currentPage: PAGE_INPUT}, '', '');
            }
        }.bind(this);
    }


    showEditor(svgData) {
        this.iconManager.show();
        setTimeout(function() {
            this.iconManager.onSvgLoaded(svgData);
        }.bind(this), TRANSITION_TIME);

        window.history.pushState({ currentPage: PAGE_EDITOR }, '', '');
    }


    showInput() {
        this.iconManager.hide();
    }

}

module.exports = Dispatcher;
