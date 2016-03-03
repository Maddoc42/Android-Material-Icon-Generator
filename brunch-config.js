exports.config = {
    files: {
        javascripts: {
            joinTo: {
                'js/index.js': 'app/js/*',
                'js/vendor.js': /^vendor/
            }
        },
        stylesheets: {
            joinTo: {
                'css/index.css': 'app/styles/*',
            }
        },
        templates: {
            joinTo: {
                'js/templates.js': /.+\.jade$/
            }
        }
    },
    plugins: {
        jade: {
            options: {
                pretty: '\t'
            }
        },
        static_jade: {
            extension: '.static.jade',
            asset: 'public'
        }
    }
};
