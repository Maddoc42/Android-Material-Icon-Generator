'use strict';

let JSZip = require('js/jszip.min'),
    paper = require('js/paper-core.min'),
    paperScope = require('js/PaperScopeManager'),
    licenses =  require('js/licenses');

const RESOLUTIONS = [
    { name: 'mdpi', factor: 1 },
    { name: 'hdpi', factor: 1.5 },
    { name: 'xhdpi', factor: 2 },
    { name: 'xxhdpi', factor: 3 },
    { name: 'xxxhdpi', factor: 4 }
];


/**
 * Creates a downloadable ZIP file.
 */
class ExportManager {

    /**
     * Creates + downloads the final ZIP file.
     */
    createAndDownloadZip() {
        let zip = new JSZip();
        let rootFolder = zip.folder('icons');

        // generate content
        this.createAndZipImages(rootFolder);
        this.createAndZipLicenses(rootFolder);

        // download
        if (JSZip.support.blob) {
            window.location = "data:application/zip;base64," + zip.generate({type:"base64"});
        } else {
            console.log('blob not supported');
            // TODO
        }
    }


    createAndZipImages(rootFolder) {
        let drawProject = paperScope.draw().project;
        for (let i = 0; i < 5; ++i) {
            let resolution = RESOLUTIONS[i];

            paperScope.activateExpo(i);
            let exportProject = paperScope.expo(i).project;

            // copy draw layer over to export canvas
            exportProject.clear();
            let layer = new paper.Layer();
            for (let j = 0; j < drawProject.layers[0].children.length; ++j) {
                layer.addChild(drawProject.layers[0].children[j].clone(false));
            }
            paperScope.expo(i).view.center = new paper.Point(24, 24); // center at icon center (which is 48 px big)
            paperScope.expo(i).view.zoom = resolution.factor;
            paperScope.expo(i).view.draw();

            // copy png
            let pngData = paperScope.expoCanvas(i)[0].toDataURL('image/png').split(',')[1];
            let pngFileName = 'icon.png';
            rootFolder.folder('mipmap-' + resolution.name).file(pngFileName, pngData, { base64: true });

            if (i !== 0) continue;

            // generate final svg
            let svg = exportProject.exportSVG({ asString: true });
            let svgData = btoa(svg);
            let svgFileName = 'icon.svg';
            rootFolder.file(svgFileName, svgData, { base64: true });
        }

        // reactivate draw scope
        paperScope.activateDraw();
    }


    createAndZipLicenses(rootFolder) {
        let licenseFolder = rootFolder.folder('LICENSE');
        licenseFolder.file('LICENSE.txt', licenses.LICENSE_GENERAL);
        licenseFolder.file('LICENSE.CC_BY_4_0.txt',  licenses.LICENSE_CC_BY_4);
    }

}

module.exports = new ExportManager();