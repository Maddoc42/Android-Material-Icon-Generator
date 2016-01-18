"use strict";

var paper = require('js/paper-core.min');

const
    SHADOW_OFFSET = 4,
    SHADOW_ITERATIONS = 50;


var App = {

    drawBounds: function(item, color) {
        var bounds = item.strokeBounds;
        var rect = new paper.Shape.Rectangle(
            bounds.point,
            bounds.size
        );
        rect.strokeColor = color;
    },


    drawPoint: function(point, color) {
        var circle = new paper.Shape.Circle(point, 5);
        circle.strokeColor = color;
        circle.fillColor = color;
    },


    drawHandle: function(point, handle, color) {
        var offset = point.add(handle);
        var line = new paper.Path.Line(point, offset);
        line.strokeColor = color;
        line.strokeWidth = 2;
    },


    drawSegment: function(segment, color) {
        drawPoint(segment.point, color);
        if (segment.handleIn) drawPoint(segment.handleIn, color);
        if (segment.handleOut) drawPoint(segment.handleOut, color);
    },


    drawCurve: function(curve, color) {
        drawPoint(curve.point1, color);
        // drawPoint(curve.point2, color);
        // if (curve.handle1) drawPoint(curve.handle1, color);
        // if (curve.handle2) drawPoint(curve.handle1, color);
        if (curve.handle1) drawHandle(curve.point1, curve.handle1, color);
        if (curve.handle2) drawHandle(curve.point2, curve.handle2, color);
    },


    simplifyPath: function(path) {
        var offsetDistance = Math.round(100 * Math.sqrt(SHADOW_OFFSET * SHADOW_OFFSET * 2)) / 100;
        var doubleOffsetDistance = Math.round(100 * Math.sqrt(SHADOW_OFFSET * SHADOW_OFFSET * 2) * 2) / 100;
        var secondLastPoint;
        var lastPoint;

        var matchCount = 0;
        var endOfMatch = false;
        var indicesToRemove = [];

        for (var i = 0; i < path.segments.length; ++i) {
            var point = path.segments[i].point;
            if (secondLastPoint) {
                var distance = Math.round(100 * point.getDistance(secondLastPoint)) / 100;
                if (distance === offsetDistance || distance === doubleOffsetDistance) {
                    ++matchCount;
                    endOfMatch = false;
                } else {
                    endOfMatch = true;
                }
                // console.log(i + ': ' + point.getDistance(secondLastPoint));
                console.log(i + ': ' + distance);
            }

            if (endOfMatch === true && matchCount > 0) {
                var msg = '';
                //--matchCount;
                for (var pointIdx = i - 1 - matchCount; pointIdx < i - 1; ++pointIdx) {
                    msg = msg + pointIdx + ', ';
                    indicesToRemove.push(pointIdx);
                }
                console.log('i = ' + i);
                console.log('removing ' + matchCount + ' items (' + msg + ')');

                matchCount = 0;
                endOfMatch = true;
            }

            secondLastPoint = lastPoint;
            lastPoint = point;
        }
        console.log(indicesToRemove.length);

        // actually remove indices from path
        indicesToRemove.reverse();
        for (i = 0; i < indicesToRemove.length; ++i) {
            path.removeSegment(indicesToRemove[i]);
        }
        console.log(path.pathData);
    },


    init: function() {

        paper.install(window);
        var canvas = $("#canvas");
        paper.setup(canvas[0]);

        var center = new paper.Point(250, 250);

        var baseRadius = 200;
        var baseShadowRadius1 = baseRadius + 15;
        var baseShadowRadius2 = baseRadius + 10;

        var baseShadow1 = new paper.Path.Circle({
            center: center.add(new paper.Point(0, 10)),
            radius: baseShadowRadius1
        });

        baseShadow1.fillColor = {
            gradient: {
                stops: [[ new paper.Color(0, 0, 0, 0.21), baseRadius / baseShadowRadius1], [ new paper.Color(0,0,0,0), 1]],
                radial: true
            },
            origin: baseShadow1.position,
            destination: baseShadow1.bounds.rightCenter
        };


        var baseShadow2 = new paper.Path.Circle({
            center: center.add(new paper.Point(0, 5)),
            radius: baseShadowRadius2
        });
        baseShadow2.fillColor = {
            gradient: {
                stops: [[ new paper.Color(0, 0, 0, 0.05), baseRadius / baseShadowRadius2], [ new paper.Color(0,0,0,0), 1]],
                radial: true
            },
            origin: baseShadow2.position,
            destination: baseShadow2.bounds.rightCenter
        };



        var base = new paper.Path.Circle({
            center: center,
            radius: baseRadius
        });
        base.fillColor = '#512DA8';
        base.strokeWidth = 0;


        paper.project.importSVG('example_no_eyes.svg', {
                onLoad: function (loadedItem) {

                    var paths = loadedItem.children[0].children;
                    var icon = paths[0];
                    icon.position = center;
                    icon.fillColor = 'white';
                    icon.strokeWidth = 0;

                    var iconShadow = icon.clone();
                    var iconCopy = icon.clone();
                    var translation = new paper.Point(SHADOW_OFFSET, SHADOW_OFFSET);

                    for (var offset = 1; offset <= SHADOW_ITERATIONS; ++offset) {
                        iconCopy.translate(translation);
                        var newShadow = iconShadow.unite(iconCopy);
                        iconShadow.remove();
                        iconShadow = newShadow;
                    }
                    iconCopy.remove();

                    newShadow = new paper.Path(iconShadow.pathData);
                    iconShadow.remove();
                    iconShadow = newShadow;
                    this.simplifyPath(iconShadow);
                    var baseClone = base.clone();
                    newShadow = iconShadow.intersect(baseClone);
                    iconShadow.remove();
                    iconShadow = newShadow;

                    // iconShadow.selected = true;

                    iconShadow.fillColor = {
                        gradient: {
                            stops:  [
                                [new paper.Color(0, 0, 0, 0.3), 0.1],
                                [new paper.Color(0, 0, 0, 0), 0.8]
                            ]
                        },
                        origin: base.bounds.topLeft,
                        destination: base.bounds.bottomRight
                    };
                    iconShadow.moveBelow(icon);
                }.bind(this),
                applyMatrix: true
            }
        );

        paper.view.draw();
    }
};

module.exports = App;
