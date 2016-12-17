'use strict';


/**
 * Manages multiple paper.PaperScope objects. They are:
 *
 * - draw: regular scope used for drawing / icon preview.
 * - expo: hidden scope / canvas used for exporting icon in a difference size.
 */
class PaperScopeManager {

    constructor() {
        // nothing
    }

    /**
     * One time setup.
     * @param drawCanvas - visible canvas for drawing.
     * @param containerExport - export container which holds all export canvases
     */
    setCanvases(drawCanvas, containerExport) {
        this.drawScope = new paper.PaperScope();
        this.drawScope.setup(drawCanvas[0]);

        this.exportCanvases = [
            containerExport.find('#canvas-export-mdpi'),
            containerExport.find('#canvas-export-hdpi'),
            containerExport.find('#canvas-export-xhdpi'),
            containerExport.find('#canvas-export-xxhdpi'),
            containerExport.find('#canvas-export-xxxhdpi'),
            containerExport.find('#canvas-export-playstore-icon')
        ];
        this.exportScopes = [];
        for (let i = 0; i < this.exportCanvases.length; ++i) {
            let exportCanvas = this.exportCanvases[i];
            let exportScope = new paper.PaperScope();
            exportScope.setup(exportCanvas[0]);
            this.exportScopes.push(exportScope);
            exportCanvas.hide();
        }
    }

    /**
     * @returns the draw PaperScope.
     */
    draw() {
        return this.drawScope;
    }

    /**
     * Activates the draw scope.
     */
    activateDraw() {
        this.drawScope.activate();
    }

    /**
     * @param {Number} idx - which scope to return
     */
    expo(idx) {
        return this.exportScopes[idx];
    }

    /**
     * @param {Number} idx - which scope to activate
     */
    activateExpo(idx) {
        this.exportScopes[idx].activate();
    }

    /**
     * @param {Number} idx - which canvas to return
     */
    expoCanvas(idx) {
        return this.exportCanvases[idx];
    }

}

module.exports = new PaperScopeManager();
