'use strict';

class Banner {

    static ID() {
        return 'banner';
    }

    constructor() {
        this.rectangle = new Path.Rectangle(15.02, 24, 30, 12);
        this.rectangle.style = {
            shadowColor: new paper.Color(0, 0, 0, 0.3),
            shadowBlur: 2,
            shadowOffset: new paper.Point(0, 1)
        };
        this.rectangle.name = Banner.ID();
        this.text = new PointText(new Point(29, 33));
        this.text.characterStyle = {
            fontSize: 8,
            fontFamily: 'sans-serif',
            fontWeight: 'bold'
        };
        this.text.justification = 'center';
        this.hide();
    }

    setBackgroundColor(color) {
        this.rectangle.fillColor = color;
    }

    setTextColor(color) {
        this.text.fillColor = color;
    }

    showBeta() {
        this.text.content = 'BETA';
        this.show();
    }

    showDev() {
        this.text.content = 'DEV';
        this.show();
    }

    show() {
        this.rectangle.visible = true;
        this.text.visible = true;
    }

    hide() {
        this.rectangle.visible = false;
        this.text.visible = false;
    }

    remove() {
        this.rectangle.remove();
        this.text.remove();
    }
}


module.exports = Banner;
