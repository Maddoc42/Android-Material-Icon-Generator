'use strict';

const TRANSITION_TIME = 500; // ms

class ErrorManager {

    constructor(errorContainer) {
        this.errorContainer = errorContainer;
        this.errorContent = this.errorContainer.find('#container-error-content');
        this.closeBtn = this.errorContainer.find('#error-close');
        this.title = errorContainer.find('#error-title');
        this.msg1 = errorContainer.find('#error-msg-1');
        this.msg2 = errorContainer.find('#error-msg-2');

        // setup close
        this.errorContainer.click(function() {
            this.dismiss();
        }.bind(this));
        this.errorContent.click(function() {
            // prevent clicks from going to background
            return false;
        });
        this.closeBtn.click(function() {
            this.dismiss();
        }.bind(this));

        this.visible = false;
    }

    show(error) {
        this.visible = true;

        // setup content
        this.title.html(error.title);
        this.msg1.html(error.msg_1);
        this.msg2.html(error.msg_2);

        // setup escape to close
        $(document).on('keyup.ErrorManager', function(event) {
            if (event.keyCode === 27) this.dismiss();
        }.bind(this));

        // show!
        this.errorContainer.css('display', 'inline');
        this.errorContainer.css('opacity', 1);
    }

    /**
     * User initiated dialog dismissal.
     */
    dismiss() {
        this.hide();
        this.dismissCallback();
    }

    /**
     * Hide dialog.
     */
    hide() {
        this.visible = false;

        // un-register key listening
        $(document).unbind('keyup.ErrorManager');

        // hide
        this.errorContainer.css('opacity', 0);
        setTimeout(function() {
            this.errorContainer.hide();
        }.bind(this), TRANSITION_TIME);
    }

    isVisible() {
        return this.visible;
    }

    /**
     * @param dismissCallback - callback which will be called when
     * the dialog is dismissed by user.
     */
    setDismissCallback(dismissCallback) {
        this.dismissCallback = dismissCallback;
    }

}


module.exports = ErrorManager;

