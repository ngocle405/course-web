(function ($) {
  Drupal.behaviors.fivestar = {
    attach: function (context) {
      $(context)
        .find('div.fivestar-form-item')
        .once('fivestar', function () {
          var $this = $(this);
          var $container = $('<div class="fivestar-widget clearfix"></div>');
          var $select = $('select', $this);
          var $cancel = $('option[value="0"]', $this);
          if ($cancel.length) {
            $(
              '<div class="cancel"><a href="#0" title="' + $cancel.text() + '">' + $cancel.text() + '</a></div>'
            ).appendTo($container);
          }
          var $options = $('option', $this).not('[value="-"], [value="0"]');
          var index = -1;
          $options.each(function (i, element) {
            var classes = 'star-' + (i + 1);
            classes += (i + 1) % 2 == 0 ? ' even' : ' odd';
            classes += i == 0 ? ' star-first' : '';
            classes += i + 1 == $options.length ? ' star-last' : '';
            $(
              '<div class="star"><a href="#' +
                element.value +
                '" title="' +
                element.text +
                '">' +
                element.text +
                '</a></div>'
            )
              .addClass(classes)
              .appendTo($container);
            if (element.value == $select.val()) {
              index = i + 1;
            }
          });
          if (index != -1) {
            $container.find('.star').slice(0, index).addClass('on');
          }
          $container.addClass('fivestar-widget-' + $options.length);
          $container
            .find('a')
            .bind('click', $this, Drupal.behaviors.fivestar.rate)
            .bind('mouseover', $this, Drupal.behaviors.fivestar.hover);
          $container.bind('mouseover mouseout', $this, Drupal.behaviors.fivestar.hover);
          $select.after($container).css('display', 'none');
          Drupal.attachBehaviors($this);
        });
    },
    rate: function (event) {
      var $this = $(this);
      var $widget = event.data;
      var value = this.hash.replace('#', '');
      $('select', $widget).val(value).change();
      var $this_star = value == 0 ? $this.parent().parent().find('.star') : $this.closest('.star');
      $this_star.prevAll('.star').andSelf().addClass('on');
      $this_star.nextAll('.star').removeClass('on');
      if (value == 0) {
        $this_star.removeClass('on');
      }
      event.preventDefault();
    },
    hover: function (event) {
      var $this = $(this);
      var $widget = event.data;
      var $target = $(event.target);
      var $stars = $('.star', $this);
      if (event.type == 'mouseover') {
        var index = $stars.index($target.parent());
        $stars.each(function (i, element) {
          if (i <= index) {
            $(element).addClass('hover');
          } else {
            $(element).removeClass('hover');
          }
        });
      } else {
        $stars.removeClass('hover');
      }
    },
  };
})(jQuery);
