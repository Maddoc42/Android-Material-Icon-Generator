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
            joinTo: 'css/app.css'
        }
    }
};
