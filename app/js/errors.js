'use strict';

module.exports = {

    // expected svg, received png for example
    ERROR_INVALID_SVG_FILE: {
        title: 'Invalid SVG file',
        msg_1: 'Please use a real SVG file instead.',
        msg_2: ''
    },

    // multiple paths etc.
    ERROR_NO_PATH_FOUND: {
        title: 'No path found',
        msg_1: 'Make sure that your SVG file contains at least a single path with a fill color.',
        msg_2: 'Details: https://github.com/Maddoc42/Android-Material-Icon-Generator#paths-do-not-have-a-fill-color'
    },

    // multiple paths etc.
    ERROR_OPEN_PATHS: {
        title: 'Path must be closed',
        msg_1: 'Your icon contains paths that are open but should be closed.',
        msg_2: 'Details: https://github.com/Maddoc42/Android-Material-Icon-Generator#paths-are-not-closed'
    }

};