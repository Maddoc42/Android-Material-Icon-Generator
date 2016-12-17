"use strict";


function drawBounds(item, color) {
    var bounds = item.strokeBounds;
    var rect = new paper.Shape.Rectangle(
        bounds.point,
        bounds.size
    );
    rect.strokeColor = color;
}


function  drawPoint(point, color) {
    var circle = new paper.Shape.Circle(point, 5);
    circle.strokeColor = color;
    circle.fillColor = color;
}


function drawHandle(point, handle, color) {
    var offset = point.add(handle);
    var line = new paper.Path.Line(point, offset);
    line.strokeColor = color;
    line.strokeWidth = 2;
}


function drawSegment(segment, color) {
    drawPoint(segment.point, color);
    if (segment.handleIn) drawPoint(segment.handleIn, color);
    if (segment.handleOut) drawPoint(segment.handleOut, color);
}


function drawCurve(curve, color) {
    drawPoint(curve.point1, color);
    // drawPoint(curve.point2, color);
    // if (curve.handle1) drawPoint(curve.handle1, color);
    // if (curve.handle2) drawPoint(curve.handle1, color);
    if (curve.handle1) drawHandle(curve.point1, curve.handle1, color);
    if (curve.handle2) drawHandle(curve.point2, curve.handle2, color);
}


module.exports = {
    drawBounds: drawBounds,
    drawPoint: drawPoint,
    drawHandle: drawHandle,
    drawSegment: drawSegment,
    drawCurve: drawCurve
};
