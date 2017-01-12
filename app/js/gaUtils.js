let gaConstants = require('js/gaConstants');

class GaUtils {

    setup() {
        $('.track').click(function() {
            let target = $(this).attr('href');
            let category = gaConstants.CATEGORY_LINK_OUTBOUND;
            if (target.indexOf('#') === 0) {
                category = gaConstants.CATEGORY_LINK_INTERNAL;
            }
            console.log('sending');
            console.log(category);
            console.log(target);
            ga('send', 'event', category, gaConstants.ACTION_CLICK, target);
        });
    }

}

module.exports = new GaUtils();
