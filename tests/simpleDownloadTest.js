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
casper.test.begin('Simple shadow create + download', 14, function (test) {
    casper.start('http://localhost:3333/');

    // disable analytics while running tests
    casper.on('resource.requested', function(requestData, request) {
        if (requestData.url.indexOf('http://www.google-analytics.com/collect?') === 0) {
            request.abort();
        }
    });

    casper.on('remote.callback', function(downloadedBinaryData) {
        // check that all files are present
        var zip = new JSZip(downloadedBinaryData);
        test.assertTruthy(zip.file('icons/LICENSE/LICENSE.txt'));
        test.assertTruthy(zip.file('icons/LICENSE/LICENSE.CC_BY_NC_3.txt'));
        test.assertTruthy(zip.file('icons/mipmap-mdpi/ic_launcher.png'));
        test.assertTruthy(zip.file('icons/mipmap-hdpi/ic_launcher.png'));
        test.assertTruthy(zip.file('icons/mipmap-xhdpi/ic_launcher.png'));
        test.assertTruthy(zip.file('icons/mipmap-xxhdpi/ic_launcher.png'));
        test.assertTruthy(zip.file('icons/mipmap-xxxhdpi/ic_launcher.png'));
        test.assertTruthy(zip.file('icons/playstore/icon.png'));
        test.assertTruthy(zip.file('icons/icon.svg'));
    });


    // wait for js setup
    casper.wait(2000, function() {
        var iconBtnId = '.icon-input-select a';
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

    // wait for shadow processing and setup download listener
    casper
        .wait(2000)
        .thenEvaluate(function() {
            $(document).on('click', '#FileSaver', function() {
                var xhr = new XMLHttpRequest();
                xhr.overrideMimeType("text/plain; charset=x-user-defined");
                xhr.open('GET', this, true);
                xhr.onload = function (e) {
                    if (this.status != 200) return;
                    const blob = this.response;
                    window.callPhantom(blob);
                };
                xhr.send();
            });
        })
        .then(function () {
            test.assertVisible('#canvas-draw');
            test.assertExists('#btn-download-svg');
            this.click('#btn-download-svg');
        });

    casper.wait(2000, function() {
        // wait for download
    });

    casper.run(function() {
        test.done();
    });
});
