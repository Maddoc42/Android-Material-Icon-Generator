'use strict';

let paper = require('js/paper-core.min');


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
     * @param drawCanvas visible canvas for drawing.
     * @param exportCanvas hidden canvas for export.
     */
    setCanvases(drawCanvas, exportCanvas) {
        this.drawScope = new paper.PaperScope();
        this.drawScope.setup(drawCanvas[0]);

        this.exportScope = new paper.PaperScope();
        this.exportScope.setup(exportCanvas[0]);
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
     * @returns the expo PaperScope.
     */
    expo() {
        return this.exportScope;
    }

    /**
     * Activates the expo scope.
     */
    activateExpo() {
        this.exportScope.activate();
    }

}

module.exports = new PaperScopeManager();
