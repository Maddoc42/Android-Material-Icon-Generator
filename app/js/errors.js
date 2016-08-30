'use strict';

module.exports = {

    // expected svg, received png for example
    ERROR_INVALID_SVG_FILE: {
        title: 'Invalid SVG file',
        msg_1: 'Please use a real SVG file instead.',
        msg_2: ''
    },

    // multiple paths etc.
    ERROR_INVALID_SVG_STRUCTURE: {
        title: 'No path found',
        msg_1: 'Make sure that your SVG file looks something like this:',
        msg_2: '&lt;svg&gt;&lt;path ... /&gt;&lt;/svg&gt;'
    },

    // multiple paths etc.
    ERROR_OPEN_PATHS: {
        title: 'Path must be closed',
        msg_1: 'Your icon contains paths that are open but should be closed.',
        msg_2: 'Details: https://github.com/Maddoc42/Android-Material-Icon-Generator#custom-svg-file-contains-only-a-single-path-but-no-output-is-generated'
    }

};