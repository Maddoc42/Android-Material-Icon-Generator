'use strict';

let IconManager = require('js/IconManager'),
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

        new IconManager(
            drawCanvas,
            $('#filePicker'),
            $('#filePickerOverlay'),
            $('#section-edit'),
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
