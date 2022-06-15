(function ($) {
  Drupal.progressBar = function (id, updateCallback, method, errorCallback) {
    var pb = this;
    this.id = id;
    this.method = method || 'GET';
    this.updateCallback = updateCallback;
    this.errorCallback = errorCallback;
    this.element = $('<div class="progress-wrapper" aria-live="polite"></div>');
    this.element.html(
      '<div id ="' +
        id +
        '" class="progress progress-striped active">' +
        '<div class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">' +
        '<div class="percentage sr-only"></div>' +
        '</div></div>' +
        '</div><div class="percentage pull-right"></div>' +
        '<div class="message">&nbsp;</div>'
    );
  };
  Drupal.progressBar.prototype.setProgress = function (percentage, message) {
    if (percentage >= 0 && percentage <= 100) {
      $('div.progress-bar', this.element).css('width', percentage + '%');
      $('div.progress-bar', this.element).attr('aria-valuenow', percentage);
      $('div.percentage', this.element).html(percentage + '%');
    }
    $('div.message', this.element).html(message);
    if (this.updateCallback) {
      this.updateCallback(percentage, message, this);
    }
  };
  Drupal.progressBar.prototype.startMonitoring = function (uri, delay) {
    this.delay = delay;
    this.uri = uri;
    this.sendPing();
  };
  Drupal.progressBar.prototype.stopMonitoring = function () {
    clearTimeout(this.timer);
    this.uri = null;
  };
  Drupal.progressBar.prototype.sendPing = function () {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    if (this.uri) {
      var pb = this;
      $.ajax({
        type: this.method,
        url: this.uri,
        data: '',
        dataType: 'json',
        success: function (progress) {
          if (progress.status == 0) {
            pb.displayError(progress.data);
            return;
          }
          pb.setProgress(progress.percentage, progress.message);
          pb.timer = setTimeout(function () {
            pb.sendPing();
          }, pb.delay);
        },
        error: function (xmlhttp) {
          pb.displayError(Drupal.ajaxError(xmlhttp, pb.uri));
        },
      });
    }
  };
  Drupal.progressBar.prototype.displayError = function (string) {
    var error = $(
      '<div class="alert alert-block alert-error"><a class="close" data-dismiss="alert" href="#">&times;</a><h4>Error message</h4></div>'
    ).append(string);
    $(this.element).before(error).hide();
    if (this.errorCallback) {
      this.errorCallback(this);
    }
  };
})(jQuery);
