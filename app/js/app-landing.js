'use strict';

let InputManager = require('js/InputManager');

module.exports = {

    init: function() {
        const inputManager = new InputManager($('#container-input'));
        inputManager.setSvgLoadedCallback(svgData => {
            console.log(svgData);
            window.location = '/editor?svg=' + encodeURIComponent(svgData);
        });
    },
};
