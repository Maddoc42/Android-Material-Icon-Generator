'use strict';

let JSZip = require('js/jszip.min'),
    paper = require('js/paper-core.min'),
    paperScope = require('js/PaperScopeManager'),
    licenses =  require('js/licenses');

const EXPORT_SETTINGS = [
    { folderName: 'mipmap-mdpi', fileName: 'ic_launcher.png', factor: 1 },
    { folderName: 'mipmap-hdpi', fileName: 'ic_launcher.png', factor: 1.5 },
    { folderName: 'mipmap-xhdpi', fileName: 'ic_launcher.png', factor: 2 },
    { folderName: 'mipmap-xxhdpi', fileName: 'ic_launcher.png', factor: 3 },
    { folderName: 'mipmap-xxxhdpi', fileName: 'ic_launcher.png', factor: 4 },
    { folderName: 'playstore', fileName: 'icon.png', factor: 512 / 48 }
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
            console.error('blob not supported');
            // TODO
        }
    }


    createAndZipImages(rootFolder) {
        let drawProject = paperScope.draw().project;
        for (let i = 0; i < EXPORT_SETTINGS.length; ++i) {
            let exportSettings = EXPORT_SETTINGS[i];

            paperScope.activateExpo(i);
            let exportProject = paperScope.expo(i).project;

            // copy draw layer over to export canvas
            exportProject.clear();
            let layer = new paper.Layer();
            for (let j = 0; j < drawProject.layers[0].children.length; ++j) {
                let child = drawProject.layers[0].children[j];
                if (!child.fillColor) continue;
                layer.addChild(child.clone(false));
            }
            paperScope.expo(i).view.center = new paper.Point(24, 24); // center at icon center (which is 48 px big)
            paperScope.expo(i).view.zoom = exportSettings.factor;
            paperScope.expo(i).view.draw();

            // copy png
            let pngData = paperScope.expoCanvas(i)[0].toDataURL('image/png').split(',')[1];
            let pngFileName = exportSettings.fileName;
            rootFolder.folder(exportSettings.folderName).file(pngFileName, pngData, { base64: true });

            if (i !== 0) continue;

            // manually created shadow for raw svg
            // huge thanks at the guys from paper js!
            // https://github.com/paperjs/paper.js/issues/1003
            let svgNode = exportProject.exportSVG();
            let filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
            filter.innerHTML = '<feColorMatrix type="matrix" values="0 0 0 0 .05  0 0 0 0 .15  0 0 0 0 .1  0 0 0 .8 0" /> <feOffset dx="0" dy="1"/> <feGaussianBlur stdDeviation="1"/> <feComposite in="SourceGraphic" />';
            filter.setAttribute('id', 'dropshadow');
            svgNode.getElementsByTagName('defs')[0].appendChild(filter);
            svgNode.getElementsByTagName('path')[0].setAttribute('filter', 'url(#dropshadow)');

            // export svg!
            let svgData = btoa(svgNode.outerHTML);
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