(function ($) {
  Drupal.ajax.prototype.beforeSend = function (xmlhttprequest, options) {
    if (this.form) {
      options.extraData = options.extraData || {};
      options.extraData.ajax_iframe_upload = '1';
      var v = $.fieldValue(this.element);
      if (v !== null) {
        options.extraData[this.element.name] = v;
      }
    }
    $(this.element).addClass('progress-disabled').attr('disabled', true);
    if (this.progress.type == 'bar') {
      var progressBar = new Drupal.progressBar(
        'ajax-progress-' + this.element.id,
        eval(this.progress.update_callback),
        this.progress.method,
        eval(this.progress.error_callback)
      );
      if (this.progress.message) {
        progressBar.setProgress(-1, this.progress.message);
      }
      if (this.progress.url) {
        progressBar.startMonitoring(this.progress.url, this.progress.interval || 1500);
      }
      this.progress.element = $(progressBar.element).addClass('ajax-progress ajax-progress-bar');
      this.progress.object = progressBar;
      $(this.element).after(this.progress.element);
    } else if (this.progress.type == 'throbber') {
      this.progress.element = $(
        '<div class="ajax-progress ajax-progress-throbber"><i class="glyphicon glyphicon-refresh glyphicon-spin"></i></div>'
      );
      if ($(this.element).is('input')) {
        if (this.progress.message) {
          $('.throbber', this.progress.element).after('<div class="message">' + this.progress.message + '</div>');
        }
        $(this.element).after(this.progress.element);
      } else {
        if (this.progress.message) {
          $('.throbber', this.progress.element).append('<div class="message">' + this.progress.message + '</div>');
        }
        $(this.element).append(this.progress.element);
      }
    }
  };
})(jQuery);
