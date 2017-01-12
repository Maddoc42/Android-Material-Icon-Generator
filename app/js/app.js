'use strict';

let IconManager = require('js/IconManager'),
    InputManager = require('js/InputManager'),
    ErrorManager = require('js/ErrorManager'),
    Dispatcher = require('js/Dispatcher'),
    gaUtils = require('js/gaUtils');

var App = {

    init: function() {
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

        let inputManager = new InputManager($('#container-input'));

        let errorManager = new ErrorManager($('#container-error'));

        new Dispatcher(
            inputManager,
            iconManager,
            errorManager,
            this.getParameterByName('icon')
        );

        // enable sidebar toggling
        $('[data-toggle="offcanvas"]').click(() => {
            $('.row-offcanvas').toggleClass('active');
        });

        gaUtils.setup();
    },

    getParameterByName: function(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

};

module.exports = App;
