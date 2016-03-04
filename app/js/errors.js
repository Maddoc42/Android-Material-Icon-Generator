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
    }

};