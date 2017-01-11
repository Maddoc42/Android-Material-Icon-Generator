'use strict';

let paperScope = require('js/PaperScopeManager'),
    licenses = require('js/licenses'),
    fileSaver = require('js/FileSaver'),
    IconBase = require('js/IconBase'),
    Banner = require('js/Banner');

const EXPORT_SETTINGS = [
    {folderName: 'mipmap-mdpi', fileName: 'ic_launcher.png', factor: 1},
    {folderName: 'mipmap-hdpi', fileName: 'ic_launcher.png', factor: 1.5},
    {folderName: 'mipmap-xhdpi', fileName: 'ic_launcher.png', factor: 2},
    {folderName: 'mipmap-xxhdpi', fileName: 'ic_launcher.png', factor: 3},
    {folderName: 'mipmap-xxxhdpi', fileName: 'ic_launcher.png', factor: 4},
    {folderName: 'playstore', fileName: 'icon.png', factor: 512 / 48}
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
        fileSaver.saveAs(zip.generate({type: 'blob'}), 'icons.zip');
    }


    createAndZipImages(rootFolder) {
        const drawProject = paperScope.draw().project;
        for (let i = 0; i < EXPORT_SETTINGS.length; ++i) {
            let exportSettings = EXPORT_SETTINGS[i];

            paperScope.activateExpo(i);
            let exportProject = paperScope.expo(i).project;

            // copy draw layer over to export canvas
            exportProject.clear();
            let layer = new paper.Layer();
            for (let j = 0; j < drawProject.layers[0].children.length; ++j) {
                let child = drawProject.layers[0].children[j];
                if (!child.fillColor || !child.visible) continue;
                let clonedChild = child.clone(false);
                layer.addChild(clonedChild);
            }
            paperScope.expo(i).view.center = new paper.Point(24, 24); // center at icon center (which is 48 px big)
            paperScope.expo(i).view.zoom = exportSettings.factor;
            paperScope.expo(i).view.draw();

            // copy png
            let pngData = paperScope.expoCanvas(i)[0].toDataURL('image/png').split(',')[1];
            let pngFileName = exportSettings.fileName;
            rootFolder.folder(exportSettings.folderName).file(pngFileName, pngData, {base64: true});

            if (i !== 0) continue;

            // manually created shadow for raw svg
            // huge thanks at the guys from paper js!
            // https://github.com/paperjs/paper.js/issues/1003
            let svgNode = exportProject.exportSVG();

            let baseFilter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
            baseFilter.innerHTML = '<feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .8 0" /> <feOffset dx="0" dy="1"/> <feGaussianBlur stdDeviation="1"/> <feComposite in="SourceGraphic" />';
            baseFilter.setAttribute('id', 'dropshadow-base');
            svgNode.getElementsByTagName('defs')[0].appendChild(baseFilter);
            let baseNode = svgNode.getElementById(IconBase.ID() + ' 1');
            if (baseNode) baseNode.setAttribute('filter', 'url(#dropshadow-base)');

            let bannerFilter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
            bannerFilter.innerHTML = '<feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .4 0" /> <feOffset dx="0" dy="1"/> <feGaussianBlur stdDeviation="0.5"/> <feComposite in="SourceGraphic" />';
            bannerFilter.setAttribute('id', 'dropshadow-banner');
            bannerFilter.setAttribute('x', '-10%');
            bannerFilter.setAttribute('y', '-10%');
            bannerFilter.setAttribute('width', '120%');
            bannerFilter.setAttribute('height', '130%');
            svgNode.getElementsByTagName('defs')[0].appendChild(bannerFilter);
            let bannerNode = svgNode.getElementById(Banner.ID() + ' 1');
            if (bannerNode) bannerNode.setAttribute('filter', 'url(#dropshadow-banner)');

            // export svg!
            let svgData = btoa(svgNode.outerHTML);
            let svgFileName = 'icon.svg';
            rootFolder.file(svgFileName, svgData, {base64: true});
        }

        // reactivate draw scope
        paperScope.activateDraw();
    }


    createAndZipLicenses(rootFolder) {
        let licenseFolder = rootFolder.folder('LICENSE');
        licenseFolder.file('LICENSE.txt', licenses.LICENSE_GENERAL);
        licenseFolder.file('LICENSE.CC_BY_NC_3.txt', licenses.LICENSE_CC_BY_NC_3);
    }

}

module.exports = new ExportManager();