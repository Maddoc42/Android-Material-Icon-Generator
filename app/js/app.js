'use strict';

let IconBase = require('js/IconBase'),
    Icon = require('js/Icon'),
    paper = require('js/paper-core.min');

const
    SHADOW_OFFSET = 4,
    SHADOW_ITERATIONS = 50;


var App = {

    init: function() {
        paper.install(window);

        // get canvas
        var canvas = $("#canvas");
        var canvasSize = canvas.width(); // assuming width = height

        // setup paper on canvas
        paper.setup(canvas[0]);

        // place icon in center on canvas
        var center = new paper.Point(canvasSize / 2, canvasSize / 2);

        // setup base
        var baseRadius = canvasSize / 2 * 0.9;
        var baseColor = '#512DA8';
        var iconBase = new IconBase(center, baseRadius, baseColor);

        // load icon
        paper.project.importSVG('example_no_eyes.svg', {
                onLoad: function (loadedItem) {

                    // get loaded path (assume only one path)
                    var paths = loadedItem.children[0].children;
                    var iconPath = paths[0];
                    iconPath.strokeWidth = 0; // remove any strokes that were imported

                    // create icon and shadow
                    var icon = new Icon(center, 'white', iconPath, iconBase);
                    icon.setSize(baseRadius * 2 * 0.65);

                }.bind(this),
                applyMatrix: true
            }
        );

        paper.view.draw();
    }
};

module.exports = App;
