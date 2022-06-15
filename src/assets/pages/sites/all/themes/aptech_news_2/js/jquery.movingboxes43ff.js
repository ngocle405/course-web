/*!
 * Moving Boxes v2.3.4
 * by Chris Coyier
 * http://css-tricks.com/moving-boxes/
 */ (function ($) {
  'use strict';
  $.movingBoxes = function (el, options) {
    var o,
      base = this;
    base.$el = $(el).addClass('mb-slider');
    base.el = el;
    base.$el.data('movingBoxes', base);
    base.init = function () {
      base.options = o = $.extend({}, $.movingBoxes.defaultOptions, options);
      base.$el.wrap('<div class="movingBoxes mb-wrapper"><div class="mb-scroll" /></div>');
      base.$window = base.$el.parent();
      base.$wrap = base.$window
        .parent()
        .prepend('<a class="mb-scrollButtons mb-left"></a>')
        .append(
          '<a class="mb-scrollButtons mb-right"></a><div class="mb-left-shadow"></div><div class="mb-right-shadow"></div>'
        );
      base.$panels = base.$el.children().addClass('mb-panel');
      base.runTime = $('.mb-slider').index(base.$el) + 1;
      base.regex = new RegExp('slider' + base.runTime + '=(\\d+)', 'i');
      base.initialized = false;
      base.currentlyMoving = false;
      base.curPanel = o.initAnimation ? 1 : base.getHash() || o.startPanel;
      base.width = o.width ? parseInt(o.width, 10) : base.$el.width();
      base.pWidth = o.panelWidth
        ? o.panelWidth <= 2
          ? o.panelWidth * base.width
          : o.panelWidth
        : base.$panels.eq(0).width();
      base.$left = base.$wrap.find('.mb-left').click(function () {
        base.goBack();
        return false;
      });
      base.$right = base.$wrap.find('.mb-right').click(function () {
        base.goForward();
        return false;
      });
      base.update({}, false);
      base.setWrap(base.curPanel);
      base.$el.delegate('.mb-panel', 'click', function (e) {
        if (!$(this).hasClass(o.currentPanel)) {
          e.preventDefault();
          base.change(base.$panels.index($(this)) + base.adj, {}, true);
        }
      });
      base.$wrap.click(function () {
        if (!base.$wrap.hasClass('mb-active-slider')) {
          base.active();
        }
      });
      base.$panels.delegate('a', 'focus', function (e) {
        e.preventDefault();
        var loc = base.$panels.index($(this).closest('.mb-panel')) + base.adj;
        if (loc !== base.curPanel) {
          base.change(loc, {}, true);
        }
      });
      $(document).keyup(function (e) {
        if (e.target.tagName.match('TEXTAREA|INPUT|SELECT')) {
          return;
        }
        switch (e.which) {
          case 39:
          case 32:
            if (base.$wrap.is('.mb-active-slider')) {
              base.goForward();
            }
            break;
          case 37:
            if (base.$wrap.is('.mb-active-slider')) {
              base.goBack();
            }
            break;
        }
      });
      $.each('preinit initialized initChange beforeAnimation completed'.split(' '), function (i, evt) {
        if ($.isFunction(o[evt])) {
          base.$el.bind(evt + '.movingBoxes', o[evt]);
        }
      });
      base.$el.trigger('preinit.movingBoxes', [base, base.curPanel]);
    };
    base.update = function (callback, flag) {
      base.$el.children('.cloned').remove();
      base.$panels = base.$el.children();
      base.adj = o.wrap && base.$panels.length > 1 ? 0 : 1;
      base.width = o.width ? parseInt(o.width, 10) : base.width;
      base.$wrap.css('width', base.width);
      if (o.wrap && base.$panels.length > 1) {
        base.$el.prepend(base.$panels.filter(':last').clone().addClass('cloned'));
        base.$el.append(base.$panels.filter(':first').clone().addClass('cloned'));
        base.$el.find('.cloned').each(function () {
          $(this).find('a,input,textarea,select,button,area').removeAttr('name').attr('disabled', 'disabled');
          $(this).find('[id]').andSelf().removeAttr('id');
        });
      }
      base.$panels = base.$el
        .children()
        .addClass('mb-panel')
        .each(function () {
          if ($(this).find('.mb-inside').length === 0) {
            $(this).wrapInner('<div class="mb-inside" />');
          }
        });
      base.totalPanels = base.$panels.filter(':not(.cloned)').length;
      if (base.totalPanels <= 1) {
        base.curPanel = 1;
      }
      base.setSizes(flag);
      base.buildNav();
      base.change(base.curPanel, callback, flag);
      base.imagesLoaded(function () {
        base.setSizes(false);
        base.setWrap(base.curPanel);
        if (!base.initialized) {
          setTimeout(function () {
            base.initialized = true;
            base.change(base.getHash() || o.startPanel, {}, false);
            base.$el.trigger('initialized.movingBoxes', [base, base.curPanel]);
          }, o.speed * 2);
        }
      });
    };
    base.setSizes = function (flag) {
      base.padding = parseInt(base.$panels.css('padding-left'), 10) + parseInt(base.$panels.css('margin-left'), 10);
      base.curWidth = o.panelWidth ? (o.panelWidth <= 2 ? o.panelWidth * base.width : o.panelWidth) : base.pWidth;
      base.regWidth = base.curWidth;
      base.$panels.css({ width: base.curWidth, fontSize: '1em' });
      base.$panels.eq(base.curPanel - base.adj).addClass(o.currentPanel);
      base.heights = base.$panels
        .css('height', 'auto')
        .map(function (i, e) {
          return $(e).outerHeight(true);
        })
        .get();
      base.returnToNormal(base.curPanel, 0);
      base.growBigger(base.curPanel, 0, flag);
      base.updateArrows(base.curPanel);
      base.$el.css({
        position: 'absolute',
        width: (base.curWidth + base.padding * 2) * base.$panels.length + (base.width - base.curWidth) / 2,
        height: Math.max.apply(this, base.heights) + 10,
        'padding-left': (base.width - base.curWidth) / 2,
      });
      base.$window.css({
        height: o.fixedHeight ? Math.max.apply(this, base.heights) : base.heights[base.curPanel - base.adj],
      });
    };
    base.buildNav = function () {
      if (base.$nav) {
        base.$nav.find('.mb-links').empty();
      } else {
        base.$nav = $('<div class="mb-controls"><span class="mb-links"></span></div>').appendTo(base.$wrap);
      }
      if (o.buildNav && base.totalPanels > 1) {
        var t,
          j,
          a = '',
          $a;
        base.$panels.filter(':not(.cloned)').each(function (i) {
          j = i + 1;
          a = '<a class="mb-link mb-panel' + j + '" href="#"></a>';
          $a = $(a);
          if ($.isFunction(o.navFormatter)) {
            t = o.navFormatter(j, $(this));
            if (typeof t === 'string') {
              $a.html(t);
            } else {
              $a = $('<a/>', t);
            }
          } else {
            $a.html(j);
          }
          $a.appendTo(base.$nav.find('.mb-links'))
            .addClass('mb-link mb-panel' + j)
            .data('index', j);
        });
        base.$nav.find('a.mb-link').bind('click', function () {
          base.change($(this).data('index'));
          return false;
        });
      }
    };
    base.returnToNormal = function (num, time) {
      var panels = base.$panels.not(':eq(' + (num - base.adj) + ')').removeClass(o.currentPanel);
      if (o.reducedSize === 1) {
        panels.css({ width: base.regWidth });
      } else {
        panels
          .stop(true, false)
          .animate({ width: base.regWidth, fontSize: o.reducedSize + 'em' }, time === 0 ? 0 : o.speed);
      }
    };
    base.growBigger = function (num, time, flag) {
      var panels = base.$panels.eq(num - base.adj);
      if (o.reducedSize === 1) {
        panels.css({ width: base.curWidth });
        setTimeout(
          function () {
            base.completed(num, flag);
          },
          time === 0 ? 0 : o.speed
        );
      } else {
        panels
          .stop(true, false)
          .animate({ width: base.curWidth, fontSize: '1em' }, time === 0 ? 0 : o.speed, function () {
            base.completed(num, flag);
          });
      }
    };
    base.setWrap = function (panel) {
      if (base.totalPanels >= 1) {
        base.growBigger(panel, 0, false);
        var leftValue =
          base.$panels.eq(panel - base.adj).position().left - (base.width - base.curWidth) / 2 + base.padding;
        base.$window.scrollLeft(leftValue);
      }
    };
    base.completed = function (num, flag) {
      var loc = base.$panels.eq(num - base.adj);
      if (!loc.hasClass('cloned')) {
        loc.addClass(o.currentPanel);
      }
      if (flag !== false) {
        base.$el.trigger('completed.movingBoxes', [base, num]);
      }
    };
    base.goForward = function (callback) {
      if (base.initialized) {
        base.change(base.curPanel + 1, callback);
      }
    };
    base.goBack = function (callback) {
      if (base.initialized) {
        base.change(base.curPanel - 1, callback);
      }
    };
    base.change = function (curPanel, callback, flag) {
      if (base.totalPanels < 1) {
        if (typeof callback === 'function') {
          callback(base);
        }
        return;
      }
      var ani,
        leftValue,
        wrapped = false;
      flag = flag !== false;
      if ($('' + curPanel).length || (curPanel instanceof $ && $(curPanel).length)) {
        curPanel = $(curPanel).closest('.mb-panel').index() + base.adj;
      } else {
        curPanel = parseInt(curPanel, 10);
      }
      if (base.initialized && flag) {
        if (!base.$wrap.hasClass('mb-active-slider')) {
          base.active();
        }
        base.$el.trigger('initChange.movingBoxes', [base, curPanel]);
      }
      if (o.wrap) {
        if (curPanel > base.totalPanels) {
          wrapped = true;
          curPanel = 1;
          base.returnToNormal(0, 0);
          base.setWrap(0);
        } else if (curPanel === 0) {
          wrapped = false;
          curPanel = base.totalPanels;
          base.setWrap(curPanel + 1);
        }
      }
      if (curPanel < base.adj) {
        curPanel = o.wrap ? base.totalPanels : 1;
      }
      if (curPanel > base.totalPanels - base.adj) {
        curPanel = o.wrap ? 1 : base.totalPanels;
      }
      if (base.curPanel !== curPanel && (!base.currentlyMoving || !base.initialized)) {
        base.currentlyMoving = !o.stopAnimation;
        base.$curPanel = base.$panels.eq(curPanel - base.adj);
        leftValue = base.$curPanel.position().left - (base.width - base.curWidth) / 2 + base.padding;
        if (base.initialized && (curPanel > base.curPanel || wrapped)) {
          leftValue -= base.curWidth - base.regWidth;
        }
        ani = o.fixedHeight
          ? { scrollLeft: leftValue }
          : { scrollLeft: leftValue, height: base.heights[curPanel - base.adj] };
        base.curPanel = curPanel;
        if (base.initialized && flag) {
          base.$el.trigger('beforeAnimation.movingBoxes', [base, curPanel]);
        }
        if (o.delayBeforeAnimate) {
          setTimeout(function () {
            base.animateBoxes(curPanel, ani, flag, callback);
          }, parseInt(o.delayBeforeAnimate, 10) || 0);
        } else {
          base.animateBoxes(curPanel, ani, flag, callback);
        }
      } else {
        base.endAnimation();
      }
    };
    base.animateBoxes = function (curPanel, ani, flag, callback) {
      base.$window
        .scrollTop(0)
        .stop(true, false)
        .animate(ani, {
          queue: false,
          duration: o.speed,
          easing: o.easing,
          complete: function () {
            if (base.initialized) {
              base.$window.scrollTop(0);
            }
            base.currentlyMoving = false;
            if (typeof callback === 'function') {
              callback(base);
            }
          },
        });
      base.returnToNormal(curPanel);
      base.growBigger(curPanel, o.speed, flag);
      base.updateArrows(curPanel);
      if (o.hashTags && base.initialized) {
        base.setHash(curPanel);
      }
      base.endAnimation();
    };
    base.endAnimation = function () {
      if (o.buildNav && base.$nav.length) {
        base.$nav
          .find('a.mb-link')
          .removeClass(o.currentPanel)
          .eq(base.curPanel - 1)
          .addClass(o.currentPanel);
      }
    };
    base.updateArrows = function (cur) {
      base.$left.toggleClass(o.disabled, (!o.wrap && cur === base.adj) || base.totalPanels <= 1);
      base.$right.toggleClass(o.disabled, (!o.wrap && cur === base.totalPanels) || base.totalPanels <= 1);
    };
    base.getHash = function () {
      var h = window.location.hash,
        i = h.indexOf('&'),
        n = h.match(base.regex);
      if (n === null && !/^#&/.test(h) && !/#!?\//.test(h)) {
        h = h.substring(0, i >= 0 ? i : h.length);
        n =
          $(h).length && $(h).closest('.mb-slider')[0] === base.el
            ? $(h).closest('.mb-panel').index() + base.adj
            : null;
      } else if (n !== null) {
        n = o.hashTags ? parseInt(n[1], 10) : null;
      }
      return n > base.totalPanels ? null : n;
    };
    base.setHash = function (n) {
      var s = 'slider' + base.runTime + '=',
        h = window.location.hash;
      if (typeof h !== 'undefined') {
        window.location.hash = h.indexOf(s) > 0 ? h.replace(base.regex, s + n) : h + '&' + s + n;
      }
    };
    base.active = function () {
      $('.mb-active-slider').removeClass('mb-active-slider');
      base.$wrap.addClass('mb-active-slider');
    };
    base.currentPanel = function (panel, callback) {
      if (typeof panel !== 'undefined') {
        base.change(panel, callback);
      }
      return base.curPanel;
    };
    base.imagesLoaded = function (callback, img) {
      var i,
        ic,
        c = true,
        t = img ? $(img) : base.$panels.find('img'),
        l = t.length;
      img = img || [];
      for (i = 0; i < l; i++) {
        if (t[i].tagName === 'IMG') {
          ic = 'fileSize' in t[i] && t[i].fileSize < 0 && t[i].count > 10 ? true : t[i].complete;
          c = c && ic && t[i].height !== 0;
          if (ic === false) {
            img.push(t[i]);
            t[i].count = (t[i].count || 0) + 1;
          }
        }
      }
      if (c) {
        if (typeof callback === 'function') {
          callback();
        }
      } else {
        setTimeout(function () {
          base.imagesLoaded(callback, img);
        }, 200);
      }
    };
    base.init();
  };
  $.movingBoxes.defaultOptions = {
    startPanel: 1,
    reducedSize: 0.8,
    fixedHeight: false,
    initAnimation: true,
    stopAnimation: false,
    hashTags: true,
    wrap: false,
    buildNav: false,
    navFormatter: null,
    easing: 'swing',
    speed: 500,
    delayBeforeAnimate: 0,
    currentPanel: 'current',
    tooltipClass: 'tooltip',
    disabled: 'disabled',
    preinit: null,
    initialized: null,
    initChange: null,
    beforeAnimation: null,
    completed: null,
  };
  $.fn.movingBoxes = function (options, callback, flag) {
    var mb;
    return this.each(function () {
      mb = $(this).data('movingBoxes');
      if ((typeof options).match('object|undefined')) {
        if (mb && options instanceof $ && options.length) {
          mb.change(options, callback, flag);
        } else if (mb) {
          mb.update(callback, flag);
        } else {
          new $.movingBoxes(this, options);
        }
      } else if (mb) {
        mb.change(options, callback, flag);
      }
    });
  };
  $.fn.getMovingBoxes = function () {
    return this.data('movingBoxes');
  };
})(jQuery);
