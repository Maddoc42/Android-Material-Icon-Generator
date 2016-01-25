'use strict';

let IconManager = require('js/IconManager'),
    FilePicker = require('js/FilePicker'),
    paper = require('js/paper-core.min'),
    paperScope = require('js/PaperScopeManager');

const
    SHADOW_OFFSET = 4,
    SHADOW_ITERATIONS = 50;


var App = {

    init: function() {
        paper.install(window);

        let drawCanvas = $('#canvas-draw');
        let exportCanvas = $('#canvas-export');

        paperScope.setCanvases(drawCanvas, exportCanvas);
        paperScope.activateDraw();


        let filePicker = new FilePicker(
            $('#filePicker'),
            $('#filePickerOverlay'),
            $('#picker-content-description'),
            $('#picker-content-loading')
        );

        new IconManager(
            drawCanvas,
            filePicker,
            $('.container-edit'),
            $('#btn-download-svg'),
            $('#color-icon'),
            $('#color-base'),
            $('#slider-shadow'),
            $('#slider-icon-size')
        );

        paperScope.draw().view.draw();
    }

};

module.exports = App;
