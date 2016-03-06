var JSZip = require('libs/jszip');

// capture regular logging msgs
casper.on('remote.message', function(message) {
    this.echo(message);
});

// capture js errors
casper.on("page.error", function(msg, trace) {
    this.echo('Error:    ' + msg, 'ERROR');
    this.echo('file:     ' + trace[0].file, 'WARNING');
    this.echo('line:     ' + trace[0].line, 'WARNING');
    this.echo('function: ' + trace[0]['function'], 'WARNING');
});


// actual test
casper.test.begin('Simple shadow create + download', 12, function (test) {
    casper.start('http://localhost:3333/');

    var downloadListener = function(resource) {
        if (resource.stage !== 'end') return;
        var contentType =  'data:application/zip;base64,';
        var url = resource.url;
        if (url.indexOf(contentType) !== 0) return;
        var zipData = url.replace(contentType, '');
        var zip = new JSZip(zipData, { base64: true });

        // check that all files are present
        test.assertTruthy(zip.file('icons/LICENSE/LICENSE.txt'));
        test.assertTruthy(zip.file('icons/mipmap-mdpi/ic_launcher.png'));
        test.assertTruthy(zip.file('icons/mipmap-hdpi/ic_launcher.png'));
        test.assertTruthy(zip.file('icons/mipmap-xhdpi/ic_launcher.png'));
        test.assertTruthy(zip.file('icons/mipmap-xxhdpi/ic_launcher.png'));
        test.assertTruthy(zip.file('icons/mipmap-xxxhdpi/ic_launcher.png'));
        test.assertTruthy(zip.file('icons/icon.svg'));
    };
    casper.on('resource.received', downloadListener);

    // wait for js setup
    casper.wait(1000, function() {
        var iconBtnId = '#container-icon-selector';
        test.assertExists(iconBtnId);
        this.click(iconBtnId);
    });

    // scroll down anim
    var iconId = '.container-icon-anchor[data-icon-category="action"][data-icon-name="android"]';
    casper.waitUntilVisible(iconId, function() {
        test.assertExists(iconId);
        test.assertVisible(iconId);
        this.click(iconId);
    });

    // wait for shadow processing
    casper.wait(1000, function() {
        test.assertVisible('#canvas-draw');
        test.assertExists('#btn-download-svg');
        this.click('#btn-download-svg');
    });

    casper.wait(1000, function() {
        // wait for download
    });

    casper.run(function() {
        test.done();
        casper.removeListener('resource.received', downloadListener);
    });
});
