(function ($) {
  Drupal.behaviors.owlcarousel = {
    attach: function (context, settings) {
      for (var carousel in settings.owlcarousel) {
        var owl = $('.' + carousel);
        if (settings.owlcarousel[carousel].settings.lazyLoad) {
          var images = owl.find('img');
          $.each(images, function (i, image) {
            $(image).attr('data-src', $(image).attr('src'));
          });
          images.addClass('lazyOwl');
        }
        if (!owl.hasClass('disabled')) {
          owl.owlCarousel(settings.owlcarousel[carousel].settings);
        }
        if (settings.owlcarousel[carousel].views.ajax_pagination) {
          var owlnav = $('.' + carousel);
          owlnav.parent().css('height', owlnav.height());
          var view = owlnav.parent().parent();
          var next = $(view).find('.pager-next a', context);
          var prev = $(view).find('.pager-previous a', context);
          $(next).once('ajax', function () {
            $(next, context).click(function () {
              owlnav.trigger('owl.next');
            });
          });
          $(prev).once('ajax', function () {
            $(prev, context).click(function () {
              owlnav.trigger('owl.prev');
            });
          });
        }
      }
    },
  };
})(jQuery);
