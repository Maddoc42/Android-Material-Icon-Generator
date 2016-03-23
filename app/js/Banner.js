'use strict';

let paper = require('js/paper-core.min'),
    paperScope = require('js/PaperScopeManager');

class Banner {

    /**
     * @param iconBase of the icon used to cut the banner
     */

    constructor() {
      this.rectangle = new Path.Rectangle(14.02,25,30,10);
      this.rectangle.style = {
        fillColor: "#373B3C",
        shadowColor: new paper.Color(0, 0, 0, 0.6),
        shadowBlur: 20
      }
      this.text = new PointText(new Point(19, 33));
      this.text.content = "BETA";
      this.text.characterStyle = {
          fontSize:8,
          fillColor:"white",
          font:"Arial"
      }
      this.hideBanner();
    }

    setBackgroundColor(color) {
      this.rectangle.fillColor = color;
    }

    setTextColor(color) {
      this.text.fillColor = color;
    }

    showBanner(){
      this.rectangle.visible = true;
      this.text.visible = true;
    }

    hideBanner(){
      this.rectangle.visible = false;
      this.text.visible = false;
    }
}


module.exports = Banner;
