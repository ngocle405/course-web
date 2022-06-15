(function ($) {
  Drupal.behaviors.scroll_to_top = {
    attach: function (context, settings) {
      var exist = jQuery('#back-top').length;
      if (exist == 0) {
        $('body').append(
          "<p id='back-top'><a href='#top'><span id='button'></span><span id='link'>" +
            settings.scroll_to_top.label +
            '</span></a></p>'
        );
      }
      $('input').change(function () {
        var style =
          '<style>#scroll-to-top-prev-container #back-top-prev span#button-prev{ background-color:' +
          $('#edit-scroll-to-top-bg-color-out').val() +
          ';} #scroll-to-top-prev-container #back-top-prev span#button-prev:hover{ background-color:' +
          $('#edit-scroll-to-top-bg-color-hover').val() +
          ' }</style>';
        var html =
          "<p id='back-top-prev' style='position:relative;'><a href='#top'><span id='button-prev'></span><span id='link'>";
        if ($('#edit-scroll-to-top-display-text').attr('checked')) {
          html += $('#edit-scroll-to-top-label').val();
        }
        html += '</span></a></p>';
        $('#scroll-to-top-prev-container').html(style + html);
      });
      $('#back-top').hide();
      $(function () {
        $(window).scroll(function () {
          if ($(this).scrollTop() > 100) {
            $('#back-top').fadeIn();
          } else {
            $('#back-top').fadeOut();
          }
        });
        $('#back-top a').click(function () {
          $('body,html').animate({ scrollTop: 0 }, 800);
          return false;
        });
      });
    },
  };
})(jQuery);
