exports.config = {
    files: {
        javascripts: {
            joinTo: {
                'js/index.js': 'app/js/index/*',
                'js/iconPicker.js': 'app/js/iconPicker/*',
                'js/vendor.js': /^vendor/
            }
        },
        stylesheets: {
            joinTo: {
                'css/index.css': 'app/styles/index/*',
                'css/iconPicker.css': 'app/styles/iconPicker/*'
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
