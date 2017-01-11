'use strict';

let IconManager = require('js/IconManager');
let ErrorManager = require('js/ErrorManager');
let gaConstants = require('js/gaConstants');

module.exports = {
    init: function () {
        let iconManager = new IconManager(
            $('#canvas-draw'),
            $('#container-edit'),
            $('#btn-download-svg'),
            $('#color-icon'),
            $('#color-base'),
            $('#slider-icon-size'),
            $('#slider-shadow-length'),
            $('#slider-shadow-intensity'),
            $('#slider-shadow-fading'),
            $('#checkbox-center-icon'),
            $('#color-banner-background'),
            $('#color-banner-text')
        );

        // error handling
        let errorManager = new ErrorManager($('#container-error'));
        iconManager.setErrorCallback(error => {
            console.log('error');
            ga('send', 'event', gaConstants.CATEGORY_INPUT, gaConstants.ACTION_ERROR, error.title);
            errorManager.show(error);
        });
        errorManager.setDismissCallback(() => {
            console.log('error');
            window.history.back();
        });

        // trigger editor start
        const svg = this.getParameterByName('svg');
        iconManager.onSvgLoaded(svg);
    },

    getParameterByName: function (name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }
};

