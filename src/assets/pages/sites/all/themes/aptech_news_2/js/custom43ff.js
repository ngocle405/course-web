(function ($) {
  Drupal.behaviors.giaidieu = {
    attach: function (context, settings) {
      $('h4.panel-title > a').click(function () {});
      $('.carousel-control.left').click(function () {
        $('#slideshow-front-001').carousel('prev');
      });
      $('.carousel-control.right').click(function () {
        $('#slideshow-front-001').carousel('next');
      });
      if ($('.webform-confirmation').length) {
        $('#block-webform-client-block-5352 h3').text('');
        console.log('test');
      }
      $(document).bind('cbox_closed', function () {
        location.reload();
      });
      $(window).scroll(function () {
        if ($(this).scrollTop() > 90) {
          $('header#navbar').addClass('scrolling');
        } else {
          $('header#navbar').removeClass('scrolling');
        }
      });
      if ($('.custom-link').length) {
        $('.custom-link')
          .find('.de_tai')
          .wrap('<a href="' + $('.custom-link').find('.views-field-field-anh-nho-tren-panel a').attr('href') + '">');
      }
      if ($('.node-mktintucsukien').length && $('.banner-full').length) {
        if ($('.node-mktintucsukien').attr('news-img') != '') {
          $('.banner-full')
            .find('.banner')
            .attr(
              'style',
              'background: url(' + $('.node-mktintucsukien').attr('news-img') + ') 50% -43px / cover fixed;'
            );
        }
      }
      if ($('.node-san-pham-sinh-vien').length && $('.banner-full').length) {
        if ($('.node-san-pham-sinh-vien').attr('news-img') != '') {
          $('.banner-full')
            .find('.banner')
            .attr(
              'style',
              'background: url(' + $('.node-san-pham-sinh-vien').attr('news-img') + ') 50% -43px / cover fixed;'
            );
        }
      }
      $('a#comments-bt').click(function () {
        $($(this).attr('href')).removeClass('hide');
      });
      var width_window = $(window).width();
      if (width_window == 768) {
        $('a.mobile-change').text('Đào Tạo');
      }
      if (width_window < 768) {
        $('#block-block-13 h2.block-title').after($('#block-block-14 .block-content'));
        $('#block-block-18 h2.block-title').after($('#block-block-19 .block-content'));
      }
      if (width_window > 1024) {
        $(window).scroll(function () {
          if ($(this).scrollTop() > 700) {
            $('.footer_slideshow').addClass('scrolling-fixed');
          } else {
            $('.footer_slideshow').removeClass('scrolling-fixed');
          }
        });
      }
      if (width_window < 768) {
        $('.header .navbar-collapse .main-menu ul.menu > li.dropdown').append(
          '<span class="btn-click"><i class="fa fa-chevron-down" aria-hidden="true"></i></span>'
        );
        $('.header .navbar-collapse .main-menu ul.menu > li.dropdown')
          .once()
          .on('click', 'span.btn-click', function () {
            var menu_slide = $(this).parent().find(' > ul.dropdown-menu');
            if (menu_slide.hasClass('active_menu')) {
              menu_slide.removeClass('active_menu').slideUp();
            } else {
              $('.header .navbar-collapse .main-menu ul.menu ul.dropdown-menu.active_menu')
                .removeClass('active_menu')
                .slideUp();
              menu_slide.addClass('active_menu').slideDown();
            }
          });
      }
      if ($('.navbar-nav .dropdown').length) {
        console.log(width_window);
        var menuItem = $('.navbar-nav .dropdown');
        menuItem.each(function () {
          $(this).hover(function () {
            $(this).addClass('open');
          });
          $(this).mouseleave(function () {
            $(this).removeClass('open');
          });
          $(this)
            .find('a')
            .click(function () {
              window.location = $(this).attr('href');
            });
        });
      }
      $('#webform-client-form-5352 .webform-submit').html('Đăng ký');
      if ($('.cua_noi_hay').length) {
        $('.cua_noi_hay').each(function () {
          var image_bg = $(this).attr('url-image');
          $(this).css('background-image', 'url(' + image_bg + ')');
        });
      }
      if ($('.form_register ').length) {
        $('.form_register .form-item').each(function () {
          var placeholder = $(this).find('label').text();
          $(this).find('input').attr('placeholder', placeholder);
        });
      }
      if ($('.custom-contact-map').length) {
        $('.contact_frontcontent_2').before($('.custom-contact-map').wrapInner('<div class="container"></div>'));
        if (!$('.custom-contact-map .map-header').length) {
          $('.custom-contact-map .block-content').before(
            '<div class="map-header">' +
              '<p class="text-desc">Đăng kí nhận bản tin APTECH để cập nhật thông tin mới nhất của các khoá học sắp khai giảng 2016</p>' +
              '<form name="custom-news-sletter">' +
              '<span class="item"><input type="text" name="contact_name" placeholder="Họ & tên"></span>' +
              '<span class="item"><input type="email" name="contact_email" placeholder="Email"></span>' +
              '<span class="item"><input type="submit" name="contact_submit" value="Gửi"></span>' +
              '</form>' +
              '</div>'
          );
        }
      }
    },
  };
})(jQuery);
