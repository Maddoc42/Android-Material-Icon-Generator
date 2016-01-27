'use strict';

let materialIcons = require('js/iconPicker/materialIcons');


var App = {

    init: function() {

        let iconsContainer = $('#container-icons');
        let categoryTemplate = $('#template-category');
        let hrTemplate = $('#template-hr');
        let iconTemplate = $('#template-icon');

        for (let i = 0; i < materialIcons.length; ++i) {
            // add hr
            if (i != 0) {
                let hr = hrTemplate.clone();
                hr.removeAttr('id');
                iconsContainer.append(hr);
            }

            let category = materialIcons[i];

            // create + append category
            let categoryDiv = categoryTemplate.clone();
            categoryDiv.removeAttr('id');
            iconsContainer.append(categoryDiv);

            // set category data
            let categoryName = category.category;
            let fileNames = category.fileNames;
            categoryDiv.find('h2').html(categoryName);

            for (let j = 0; j < fileNames.length; ++j) {
                let fileName = fileNames[j];

                // create + append icon
                let iconDiv = iconTemplate.clone();
                iconDiv.removeAttr('id');
                categoryDiv.append(iconDiv);

                // set icon
                let img = iconDiv.find('img');
                img.attr('src', '../material-icons/' + categoryName + '/' + fileName);

                // set icon name fileName
                let iconName = fileName.replace('ic_', '').replace('_48px.svg', '').replace(new RegExp('_', 'g'), ' ');
                iconDiv.find('.icon-title').html(iconName);

                // set link
                iconDiv.find('.container-icon-anchor').attr('href', '../?icon=' + 'material-icons/' + categoryName + '/' + fileName);
            }
        }

    }

};

module.exports = App;
