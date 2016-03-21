'use strict';

let paper = require('js/paper-core.min'),
    paperScope = require('js/PaperScopeManager');

class Banner {

    /**
     * @param iconBase of the icon used to cut the shadow
     */

    constructor(iconPath, iconBase) {
        this.iconBase = iconBase;
        this.iconPath = iconPath;
        this.bannerBeta = false;
    }

    setBannerBeta(boolean){
      this.bannerBeta = boolean;
    }

    applyBanner(){
      if(!this.bannerBeta){
        if(this.rectangle)
          this.rectangle.remove();
        if(this.text)
          this.text.remove();
        return;
      }
      let basePath = this.iconBase.getPathWithoutShadows();

      this.rectangle = new Path.Rectangle(14.02,25,30,10);
      this.rectangle.style = {
        fillColor:'#373B3C',
        shadowColor: new paper.Color(0, 0, 0, 0.6),
        shadowBlur: 20
      }
      this.text = new PointText(new Point(18, 33));
      this.text.content = "BETA";
      this.text.characterStyle = {
          fontSize:8,
          fillColor:"white",
          font:"Arial"
      }
      this.text.intersects(this.rectangle);
    }
}


module.exports = Banner;
