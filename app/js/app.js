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
        var canvas = $("#canvas");
        paper.setup(canvas[0]);

        var center = new paper.Point(250, 250);
        var baseRadius = 200;
        var baseColor = '#512DA8';

        var iconBase = new IconBase(center, baseRadius, baseColor);


        paper.project.importSVG('example_no_eyes.svg', {
                onLoad: function (loadedItem) {

                    var paths = loadedItem.children[0].children;
                    var iconPath = paths[0];
                    iconPath.strokeWidth = 0;

                    var icon = new Icon(center, 'white', iconPath, iconBase);

                }.bind(this),
                applyMatrix: true
            }
        );

        paper.view.draw();
    }
};

module.exports = App;
