'use strict';

let paper = require('js/paper-core.min');

class Banner {

    constructor() {
      this.rectangle = new Path.Rectangle(14.02,24,30,12);
      this.rectangle.style = {
        shadowColor: new paper.Color(0, 0, 0, 0.6),
        shadowBlur: 20
      };
      this.text = new PointText(new Point(19, 33));
      this.text.content = "BETA";
      this.text.characterStyle = {
          fontSize: 8,
          fontFamily: 'sans-serif',
          fontWeight: 'bold'
      };
      this.hide();
    }

    setBackgroundColor(color) {
      this.rectangle.fillColor = color;
    }

    setTextColor(color) {
      this.text.fillColor = color;
    }

    show(){
      this.rectangle.visible = true;
      this.text.visible = true;
    }

    hide(){
      this.rectangle.visible = false;
      this.text.visible = false;
    }

    remove() {
        this.rectangle.remove();
        this.text.remove();
    }
}


module.exports = Banner;
