(function ($) {
  Drupal.ajax.prototype.commands.viewsLoadMoreAppend = function (ajax, response, status) {
    var wrapper = response.selector ? $(response.selector) : $(ajax.wrapper);
    var method = response.method || ajax.method;
    var targetList = response.targetList || '';
    var effect = ajax.getEffect(response);
    var pager_selector = response.options.pager_selector ? response.options.pager_selector : '.pager-load-more';
    var new_content_wrapped = $('<div></div>').html(response.data);
    var new_content = new_content_wrapped.contents();
    if (new_content.length != 1 || new_content.get(0).nodeType != 1) {
      new_content = new_content_wrapped;
    }
    var settings = response.settings || ajax.settings || Drupal.settings;
    Drupal.detachBehaviors(wrapper, settings);
    if ($.waypoints != undefined) {
      $.waypoints('refresh');
    }
    var content_query =
      targetList && !response.options.content
        ? '> .view-content ' + targetList
        : response.options.content || '> .view-content';
    if (effect.showEffect != 'show') {
      new_content.find(content_query).children().hide();
    }
    wrapper.find(pager_selector).replaceWith(new_content.find(pager_selector));
    wrapper.find(content_query)[method](new_content.find(content_query).children());
    wrapper
      .find(content_query)
      .children()
      .removeClass('views-row-first views-row-last views-row-odd views-row-even')
      .filter(':first')
      .addClass('views-row-first')
      .end()
      .filter(':last')
      .addClass('views-row-last')
      .end()
      .filter(':even')
      .addClass('views-row-odd')
      .end()
      .filter(':odd')
      .addClass('views-row-even')
      .end();
    if (effect.showEffect != 'show') {
      wrapper.find(content_query).children(':not(:visible)')[effect.showEffect](effect.showSpeed);
    }
    wrapper.trigger('views_load_more.new_content', new_content.clone());
    var classes = wrapper.attr('class');
    var onceClass = classes.match(/jquery-once-[0-9]*-[a-z]*/);
    wrapper.removeClass(onceClass[0]);
    settings = response.settings || ajax.settings || Drupal.settings;
    Drupal.attachBehaviors(wrapper, settings);
  };
  Drupal.behaviors.ViewsLoadMore = {
    attach: function (context, settings) {
      var default_opts = { offset: '100%' };
      if (settings && settings.viewsLoadMore && settings.views && settings.views.ajaxViews) {
        $.each(settings.viewsLoadMore, function (i, setting) {
          var view = '.view-id-' + setting.view_name + '.view-display-id-' + setting.view_display_id + ' .pager-next a',
            opts = {};
          $.extend(opts, default_opts, settings.viewsLoadMore[i].opts);
          $(view).waypoint('destroy');
          $(view).waypoint(function (event, direction) {
            $(view).click();
          }, opts);
        });
      }
    },
    detach: function (context, settings, trigger) {
      if (settings && settings.viewsLoadMore && settings.views && settings.views.ajaxViews) {
        $.each(settings.viewsLoadMore, function (i, setting) {
          var view = '.view-id-' + setting.view_name + '.view-display-id-' + setting.view_display_id;
          if ($(context).is(view)) {
            $('.pager-next a', view).waypoint('destroy');
          } else {
            $(view, context).waypoint('destroy');
          }
        });
      }
    },
  };
})(jQuery);
