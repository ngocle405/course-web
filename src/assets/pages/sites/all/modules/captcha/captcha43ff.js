(function ($) {
  Drupal.behaviors.captcha = {
    attach: function (context) {
      $('#edit-captcha-response').attr('autocomplete', 'off');
    },
  };
  Drupal.behaviors.captchaAdmin = {
    attach: function (context) {
      $('#edit-captcha-add-captcha-description').click(function () {
        if ($('#edit-captcha-add-captcha-description').is(':checked')) {
          $('div.form-item-captcha-description').show('slow');
        } else {
          $('div.form-item-captcha-description').hide('slow');
        }
      });
      if (!$('#edit-captcha-add-captcha-description').is(':checked')) {
        $('div.form-item-captcha-description').hide();
      }
    },
  };
})(jQuery);
