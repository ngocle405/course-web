(function ($) {
  Drupal.behaviors.colorboxNode = {
    attach: function (context, settings) {
      if (!$.isFunction($.colorbox) || typeof settings.colorbox === 'undefined') {
        return;
      }
      if (settings.colorbox.mobiledetect && window.matchMedia) {
        var mq = window.matchMedia('(max-device-width: ' + settings.colorbox.mobiledevicewidth + ')');
        if (mq.matches) {
          return;
        }
      }
      $('.colorbox-node', context).once('init-colorbox-node-processed', function () {
        $(this).colorboxNode({ launch: false });
      });
      $('ul.contextual-links a', context)
        .once('colorboxNodeContextual')
        .click(function () {
          $.colorbox.close();
        });
    },
  };
  $.fn.colorboxNode = function (options) {
    var settings = {
      launch: true,
      width: Drupal.settings.colorbox_node.width,
      height: Drupal.settings.colorbox_node.height,
    };
    $.extend(settings, options);
    var href = $(this).attr('data-href');
    if (typeof href == 'undefined' || href == false) {
      href = $(this).attr('href');
    }
    var parse = document.createElement('a');
    parse.href = href;
    if (!href) {
      alert(Drupal.t('No url found on element'));
    }
    var base_path = Drupal.settings.basePath;
    var path_prefix = Drupal.settings.pathPrefix;
    var pathname = parse.pathname;
    if (pathname.charAt(0) != '/') {
      pathname = '/' + parse.pathname;
    }
    var url = $.getParameterByName('q', href);
    if (base_path != '/') {
      if (url != '') {
        var link = pathname.replace(
          base_path,
          base_path + parse.search.replace('?q=', '?q=/' + path_prefix + 'colorbox/')
        );
      } else {
        var link = pathname.replace(base_path, base_path + path_prefix + 'colorbox/') + parse.search;
      }
    } else {
      if (url != '') {
        var link = base_path + parse.search.replace('?q=', '?q=/' + path_prefix + 'colorbox/');
      } else {
        var link = base_path + path_prefix + 'colorbox' + pathname + parse.search;
      }
    }
    var element_settings = {};
    element_settings.progress = { type: 'none' };
    if (href) {
      element_settings.url = link;
      element_settings.event = 'click';
    }
    $(this).click(function () {
      var $this = $(this).clone();
      if (!$this.hasClass('colorbox-node-gallery')) {
        $this.attr('rel', '');
      }
      var innerWidth = $this.data('inner-width');
      var innerHeight = $this.data('inner-height');
      if (typeof innerWidth != 'undefined' && typeof innerHeight != 'undefined') {
        var params = $.urlDataParams(innerWidth, innerHeight);
      } else {
        var params = $.urlParams(href);
      }
      if (params.innerHeight == undefined) params.innerHeight = settings.height;
      if (params.innerWidth == undefined) params.innerWidth = settings.width;
      params.html = '<div id="colorboxNodeLoading"></div>';
      params.onComplete = function () {
        $this.colorboxNodeGroup();
      };
      params.open = true;
      $this.colorbox($.extend({}, Drupal.settings.colorbox, params));
    });
    var base = $(this).attr('id');
    Drupal.ajax[base] = new Drupal.ajax(base, this, element_settings);
    if (settings.launch) {
      Drupal.ajax[base].eventResponse(this, 'click');
      $(this).click();
    }
  };
  $.fn.colorboxNodeGroup = function () {
    var $this = $(this);
    var rel = $this.attr('rel');
    if (rel && $this.hasClass('colorbox-node-gallery')) {
      if ($('a.colorbox-node-gallery[rel="' + rel + '"]:not("#colorbox a[rel="' + rel + '"]")').length > 1) {
        $related = $('a.colorbox-node-gallery[rel="' + rel + '"]:not("#colorbox a[rel="' + rel + '"]")');
        var $related_unique = [];
        $related.each(function () {
          $.findHref($related_unique, this.href);
          if (!$.findHref($related_unique, this.href).length) {
            $related_unique.push(this);
          }
        });
        var current = $.findHref($related_unique, $this.get(0).href);
        $related = $($related_unique);
        var idx = $related.index($(current));
        var tot = $related.length;
        $('#cboxPrevious, #cboxNext').show();
        $.colorbox.next = function () {
          index = getIndex(1);
          $related[index].click();
        };
        $.colorbox.prev = function () {
          index = getIndex(-1);
          $related[index].click();
        };
        $('#cboxCurrent')
          .html(Drupal.settings.colorbox.current.replace('{current}', idx + 1).replace('{total}', tot))
          .show();
        $('#cboxNext').html(Drupal.settings.colorbox.next).show();
        $('#cboxPrevious').html(Drupal.settings.colorbox.previous).show();
        var prefix = 'colorbox';
        $(document).unbind('keydown.' + prefix);
        $(document).bind('keydown.' + prefix, function (e) {
          var key = e.keyCode;
          if ($related[1] && !e.altKey) {
            if (key === 37) {
              e.preventDefault();
              $.colorbox.prev();
            } else if (key === 39) {
              e.preventDefault();
              $.colorbox.next();
            }
          }
        });
      }
      function getIndex(increment) {
        var max = $related.length;
        var newIndex = (idx + increment) % max;
        return newIndex < 0 ? max + newIndex : newIndex;
      }
    }
  };
  $.findHref = function (items, href) {
    return $.grep(items, function (n, i) {
      return n.href == href;
    });
  };
  $.urlParams = function (url) {
    var p = {},
      e,
      a = /\+/g,
      r = /([^&=]+)=?([^&]*)/g,
      d = function (s) {
        return decodeURIComponent(s.replace(a, ' '));
      },
      q = url.split('?');
    while ((e = r.exec(q[1]))) {
      e[1] = d(e[1]);
      e[2] = d(e[2]);
      switch (e[2].toLowerCase()) {
        case 'true':
        case 'yes':
          e[2] = true;
          break;
        case 'false':
        case 'no':
          e[2] = false;
          break;
      }
      if (e[1] == 'width') {
        e[1] = 'innerWidth';
      }
      if (e[1] == 'height') {
        e[1] = 'innerHeight';
      }
      p[e[1]] = e[2];
    }
    return p;
  };
  $.urlDataParams = function (innerWidth, innerHeight) {
    return { innerWidth: innerWidth, innerHeight: innerHeight };
  };
  $.getParameterByName = function (name, href) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regexString = '[\\?&]' + name + '=([^&#]*)';
    var regex = new RegExp(regexString);
    var found = regex.exec(href);
    if (found == null) return '';
    else return decodeURIComponent(found[1].replace(/\+/g, ' '));
  };
})(jQuery);
