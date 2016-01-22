'use strict';

let IconManager = require('js/IconManager'),
    paper = require('js/paper-core.min');

const
    SHADOW_OFFSET = 4,
    SHADOW_ITERATIONS = 50;


var App = {

    init: function() {
        paper.install(window);

        var canvas = $('#canvas');
        paper.setup(canvas[0]);
        new IconManager(canvas, $('#filePicker'), $('#filePickerOverlay'), $('#btn-download-svg'));

        paper.view.draw();
    }

};

module.exports = App;
