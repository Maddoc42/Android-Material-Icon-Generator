'use strict';

let IconManager = require('js/index/IconManager'),
    InputManager = require('js/index/InputManager'),
    paper = require('js/index/paper-core.min'),
    paperScope = require('js/index/PaperScopeManager');

var App = {

    init: function() {
        paper.install(window);

        let drawCanvas = $('#canvas-draw');
        let exportCanvas = $('#canvas-export');

        drawCanvas.attr('height', drawCanvas.height());
        drawCanvas.attr('width', drawCanvas.height());
        paperScope.setCanvases(drawCanvas, exportCanvas);
        paperScope.activateDraw();


        let inputManager = new InputManager(
            $('#container-input'),
            this.getParameterByName('icon')
        );

        let checkboxCenterIcon = $('#checkbox-center-icon');
        checkboxCenterIcon.bootstrapToggle();

        new IconManager(
            drawCanvas,
            inputManager,
            $('#container-edit'),
            $('#btn-download-svg'),
            $('#color-icon'),
            $('#color-base'),
            $('#slider-icon-size'),
            $('#slider-shadow-length'),
            $('#slider-shadow-intensity'),
            $('#slider-shadow-fading'),
            checkboxCenterIcon
        );

        paperScope.draw().view.draw();
    },

    getParameterByName: function(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

};

module.exports = App;
