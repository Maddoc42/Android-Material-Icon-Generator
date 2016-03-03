'use strict';

let IconManager = require('js/IconManager'),
    InputManager = require('js/InputManager'),
    Dispatcher = require('js/Dispatcher'),
    paper = require('js/paper-core.min'),
    paperScope = require('js/PaperScopeManager');

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
            $('#checkbox-center-icon')
        );

        let inputManager = new InputManager($('#container-input'));

        new Dispatcher(
            inputManager,
            iconManager,
            this.getParameterByName('icon')
        );
    },

    getParameterByName: function(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

};

module.exports = App;
