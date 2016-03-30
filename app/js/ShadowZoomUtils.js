/**
 * Unfortunately paper.js drop shadows are not scaled properly
 * when setting the zoom factor on a project view. This class
 * helps with manually setting the shadow values depending on the chosen
 * zoom factor.
 */

let paperScope = require('js/PaperScopeManager');

class ShadowZoomUtils {

    /**
     * @param {object} shadowStyleOptions - A shadow style in its original size.
     */
    static zoomShadowToEditorSize(shadowStyleOptions) {
        const zoom = paperScope.draw().view.zoom;
        if (shadowStyleOptions.shadowBlur) {
            shadowStyleOptions.shadowBlur = shadowStyleOptions.shadowBlur * zoom;
        }
        if (shadowStyleOptions.shadowOffset) {
            shadowStyleOptions.shadowOffset.x = shadowStyleOptions.shadowOffset.x * zoom;
            shadowStyleOptions.shadowOffset.y = shadowStyleOptions.shadowOffset.y * zoom;
        }
    }

    /**
     * @param {object} shadowStyleOptions - A shadow style which has previously been resized to the editor zoom level.
     * @param {int} exportZoom
     */
    static zoomShadowToExportSize(shadowStyleOptions, exportZoom) {
        const zoom = paperScope.draw().view.zoom;
        if (shadowStyleOptions.shadowBlur) {
            shadowStyleOptions.shadowBlur = shadowStyleOptions.shadowBlur / zoom * exportZoom;
        }
        if (shadowStyleOptions.shadowOffset) {
            shadowStyleOptions.shadowOffset.x = shadowStyleOptions.shadowOffset.x / zoom * exportZoom;
            shadowStyleOptions.shadowOffset.y = shadowStyleOptions.shadowOffset.y / zoom * exportZoom;
        }
    }

}

module.exports = ShadowZoomUtils;