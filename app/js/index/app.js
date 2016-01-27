'use strict';

let IconManager = require('js/index/IconManager'),
    FilePicker = require('js/index/FilePicker'),
    paper = require('js/index/paper-core.min'),
    paperScope = require('js/index/PaperScopeManager');

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
