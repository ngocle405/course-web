(function () {
  var handlers = {};
  var maps = {};
  var ajaxoffset = 0;
  Drupal.gmap = {
    getMap: function (mapid) {
      if (maps[mapid]) {
        return maps[mapid];
      } else {
        mapid = mapid.split('-').slice(1, -1).join('-');
        if (maps[mapid]) {
          return maps[mapid];
        }
      }
      return false;
    },
    unloadMap: function (mapid) {
      delete maps[mapid];
    },
    addHandler: function (handler, callback) {
      if (!handlers[handler]) {
        handlers[handler] = [];
      }
      handlers[handler].push(callback);
    },
    globalChange: function (name, userdata) {
      for (var mapid in Drupal.settings.gmap) {
        if (Drupal.settings.gmap.hasOwnProperty(mapid)) {
          if (maps[mapid]) {
            maps[mapid].change(name, -1, userdata);
          }
        }
      }
    },
    setup: function (settings) {
      var obj = this;
      var initcallback = function (mapid) {
        return function () {
          maps[mapid].change('bootstrap_options', -1);
          maps[mapid].change('boot', -1);
          maps[mapid].change('init', -1);
          maps[mapid].change('maptypechange', -1);
          maps[mapid].change('controltypechange', -1);
          maps[mapid].change('alignchange', -1);
          maps[mapid].ready = true;
          maps[mapid].change('ready', -1);
        };
      };
      if (settings || (Drupal.settings && Drupal.settings.gmap)) {
        var mapid = obj.id.split('-');
        if (Drupal.settings['gmap_remap_widgets']) {
          if (Drupal.settings['gmap_remap_widgets'][obj.id]) {
            jQuery.each(Drupal.settings['gmap_remap_widgets'][obj.id].classes, function () {
              jQuery(obj).addClass(this);
            });
            mapid = Drupal.settings['gmap_remap_widgets'][obj.id].id.split('-');
          }
        }
        var instanceid = mapid.pop();
        mapid.shift();
        mapid = mapid.join('-');
        var control = instanceid.replace(/\d+$/, '');
        if (!maps[mapid]) {
          if (settings) {
            maps[mapid] = new Drupal.gmap.map(settings);
          } else {
            maps[mapid] = new Drupal.gmap.map(Drupal.settings.gmap[mapid]);
          }
          var callback = initcallback(mapid);
          setTimeout(callback, 0);
        }
        if (handlers[control]) {
          for (var i = 0; i < handlers[control].length; i++) {
            handlers[control][i].call(maps[mapid], obj);
          }
        } else {
        }
      }
    },
  };
  jQuery.fn.createGMap = function (settings, mapid) {
    return this.each(function () {
      if (!mapid) {
        mapid = 'auto' + ajaxoffset + 'ajax';
        ajaxoffset++;
      }
      settings.id = mapid;
      jQuery(this)
        .attr('id', 'gmap-' + mapid + '-gmap0')
        .css('width', settings.width)
        .css('height', settings.height)
        .addClass('gmap-control')
        .addClass('gmap-gmap')
        .addClass('gmap')
        .addClass('gmap-map')
        .addClass('gmap-' + mapid + '-gmap')
        .addClass('gmap-processed')
        .each(function () {
          Drupal.gmap.setup.call(this, settings);
        });
    });
  };
})();
Drupal.gmap.factory = {};
Drupal.gmap.map = function (v) {
  this.vars = v;
  this.map = undefined;
  this.ready = false;
  var _bindings = {};
  this.bind = function (name, callback) {
    if (!_bindings[name]) {
      _bindings[name] = [];
    }
    return _bindings[name].push(callback) - 1;
  };
  this.change = function (name, id, userdata) {
    var c;
    if (_bindings[name]) {
      for (c = 0; c < _bindings[name].length; c++) {
        if (c !== id) {
          _bindings[name][c](userdata);
        }
      }
    }
    if (name !== 'all') {
      this.change('all', -1, name, userdata);
    }
  };
  this.deferChange = function (name, id, userdata) {
    var obj = this;
    setTimeout(function () {
      obj.change(name, id, userdata);
    }, 0);
  };
  this.getMapTypeName = function (type) {
    if (type == 'map' || type == 'roadmap') return 'Map';
    if (type == 'hybrid') return 'Hybrid';
    if (type == 'physical' || type == 'terrain') return 'Physical';
    if (type == 'satellite') return 'Satellite';
  };
  this.getMapTypeId = function (type) {
    if (type == 'Map' || type == 'Roadmap') return google.maps.MapTypeId.ROADMAP;
    if (type == 'Hybrid') return google.maps.MapTypeId.HYBRID;
    if (type == 'Physical' || type == 'Terrain') return google.maps.MapTypeId.TERRAIN;
    if (type == 'Satellite') return google.maps.MapTypeId.SATELLITE;
  };
};
Drupal.gmap.addHandler('gmap', function (elem) {
  var obj = this;
  var _ib = {};
  _ib.zoom = obj.bind('zoom', function (zoom) {
    obj.map.setZoom(obj.vars.zoom);
  });
  _ib.move = obj.bind('move', function () {
    obj.map.panTo(new google.maps.LatLng(obj.vars.latitude, obj.vars.longitude));
  });
  _ib.width = obj.bind('widthchange', function (w) {
    obj.map.getDiv().style.width = w;
    google.maps.event.trigger(obj.map);
  });
  _ib.height = obj.bind('heightchange', function (h) {
    obj.map.getDiv().style.height = h;
    google.maps.event.trigger(obj.map);
  });
  _ib.ctc = obj.bind('controltypechange', function () {
    if (obj.vars.controltype === 'Small') {
      obj.map.setOptions({ zoomControlOptions: { style: google.maps.ZoomControlStyle.SMALL } });
    } else if (obj.vars.controltype === 'Large') {
      obj.map.setOptions({ zoomControlOptions: { style: google.maps.ZoomControlStyle.LARGE } });
    } else if (obj.vars.controltype === 'Android') {
      obj.map.setOptions({ zoomControlOptions: { style: google.maps.ZoomControlStyle.SMALL } });
    }
  });
  _ib.mtc = obj.bind('maptypechange', function () {
    obj.map.setMapTypeId(obj.getMapTypeId(obj.vars.maptype));
  });
  obj.bind('bootstrap_options', function () {
    var opts = {};
    obj.opts = opts;
    opts.disableDefaultUI = true;
    if (obj.vars.behavior.nodrag) {
      opts.draggable = false;
    } else if (obj.vars.behavior.nokeyboard) {
      opts.keyboardShortcuts = false;
    }
    switch (obj.vars.maptype) {
      case 'Hybrid':
        opts.mapTypeId = google.maps.MapTypeId.HYBRID;
        break;
      case 'Physical':
        opts.mapTypeId = google.maps.MapTypeId.TERRAIN;
        break;
      case 'Satellite':
        opts.mapTypeId = google.maps.MapTypeId.SATELLITE;
        break;
      case 'Map':
      default:
        opts.mapTypeId = google.maps.MapTypeId.ROADMAP;
        break;
    }
    opts.mapTypeIds = [];
    if (obj.vars.baselayers.Map) {
      opts.mapTypeIds.push(google.maps.MapTypeId.ROADMAP);
    }
    if (obj.vars.baselayers.Hybrid) {
      opts.mapTypeIds.push(google.maps.MapTypeId.HYBRID);
    }
    if (obj.vars.baselayers.Physical) {
      opts.mapTypeIds.push(google.maps.MapTypeId.TERRAIN);
    }
    if (obj.vars.baselayers.Satellite) {
      opts.mapTypeIds.push(google.maps.MapTypeId.SATELLITE);
    }
    if (obj.vars.draggableCursor) {
      opts.draggableCursor = obj.vars.draggableCursor;
    }
    if (obj.vars.draggingCursor) {
      opts.draggingCursor = obj.vars.draggingCursor;
    }
    if (obj.vars.backgroundColor) {
      opts.backgroundColor = obj.vars.backgroundColor;
    }
    opts.mapTypeControl = true;
    opts.mapTypeControlOptions = {};
    if (obj.vars.mtc === 'standard') {
      opts.mapTypeControlOptions.style = google.maps.MapTypeControlStyle.DEFAULT;
    } else if (obj.vars.mtc === 'horiz') {
      opts.mapTypeControlOptions.style = google.maps.MapTypeControlStyle.HORIZONTAL_BAR;
    } else if (obj.vars.mtc === 'menu') {
      opts.mapTypeControlOptions.style = google.maps.MapTypeControlStyle.DROPDOWN_MENU;
    } else if (obj.vars.mtc === 'none') {
      opts.mapTypeControl = false;
    }
    if (obj.vars.controltype !== 'None') {
      opts.zoomControl = true;
    }
    if (obj.vars.pancontrol) {
      opts.panControl = true;
    }
    if (obj.vars.streetviewcontrol) {
      opts.streetViewControl = true;
    }
    if (obj.vars.controltype === 'Small') {
      obj.zoomControlOptions = { style: google.maps.ZoomControlStyle.SMALL };
    } else if (obj.vars.controltype === 'Large') {
      obj.zoomControlOptions = { style: google.maps.ZoomControlStyle.LARGE };
    }
    opts.scaleControl = obj.vars.behavior.scale;
    if (obj.vars.behavior.nomousezoom) {
      opts.scrollwheel = false;
    }
    if (obj.vars.behavior.nocontzoom) {
      opts.disableDoubleClickZoom = true;
    }
    if (obj.vars.behavior.overview) {
      opts.overviewMapControl = true;
      opts.overviewMapControlOptions = { opened: true };
    }
    if (obj.vars.mapstyles) {
      obj.opts.styles = obj.vars.mapstyles;
    }
  });
  obj.bind('boot', function () {
    obj.map = new google.maps.Map(elem, obj.opts);
  });
  obj.bind('init', function () {
    var map = obj.map;
    if (obj.vars.extent) {
      var c = obj.vars.extent;
      var extent = new google.maps.LatLngBounds(
        new google.maps.LatLng(c[0][0], c[0][1]),
        new google.maps.LatLng(c[1][0], c[1][1])
      );
      obj.vars.latitude = extent.getCenter().lat();
      obj.vars.longitude = extent.getCenter().lng();
      obj.vars.zoom = map.getBoundsZoomLevel(extent);
    }
    if (obj.vars.behavior.collapsehack) {
      setTimeout(function () {
        var r = function () {
          var coord = map.getCenter();
          google.maps.event.trigger(map, 'resize');
          map.setCenter(new google.maps.LatLng(coord.lat(), coord.lng()), obj.vars.zoom);
        };
        jQuery(elem).parents('fieldset.collapsible').children('legend').children('a').click(r);
        jQuery('.vertical-tab-button', jQuery(elem).parents('.vertical-tabs')).children('a').click(r);
        jQuery(window).bind('hashchange', r);
      }, 0);
    }
    map.setCenter(new google.maps.LatLng(obj.vars.latitude, obj.vars.longitude));
    map.setZoom(obj.vars.zoom);
    google.maps.event.addListener(map, 'zoom_changed', function () {
      obj.vars.zoom = map.getZoom();
      obj.change('zoom', _ib.zoom);
    });
    google.maps.event.addListener(map, 'center_changed', function () {
      var coord = map.getCenter();
      obj.vars.latitude = coord.lat();
      obj.vars.longitude = coord.lng();
      obj.change('move', _ib.move);
    });
    google.maps.event.addListener(map, 'maptypeid_changed', function () {
      if (obj.ready) {
        obj.vars.maptype = obj.getMapTypeName(map.getMapTypeId());
        obj.change('maptypechange', _ib.mtc);
      }
    });
  });
});
Drupal.gmap.addHandler('zoom', function (elem) {
  var obj = this;
  var binding = obj.bind('zoom', function () {
    elem.value = obj.vars.zoom;
  });
  jQuery(elem).change(function () {
    obj.vars.zoom = parseInt(elem.value, 10);
    obj.change('zoom', binding);
  });
});
Drupal.gmap.addHandler('latitude', function (elem) {});
Drupal.gmap.addHandler('longitude', function (elem) {});
Drupal.gmap.addHandler('latlon', function (elem) {
  var obj = this;
  var binding = obj.bind('move', function () {
    elem.value = '' + obj.vars.latitude + ',' + obj.vars.longitude;
  });
  jQuery(elem).change(function () {
    var t = this.value.split(',');
    obj.vars.latitude = Number(t[0]);
    obj.vars.longitude = Number(t[1]);
    obj.change('move', binding);
  });
});
Drupal.gmap.addHandler('maptype', function (elem) {
  var obj = this;
  var binding = obj.bind('maptypechange', function () {
    elem.value = obj.vars.maptype;
  });
  jQuery(elem).change(function () {
    obj.vars.maptype = elem.value;
    obj.change('maptypechange', binding);
  });
});
(function () {
  var re = /([0-9.]+)\s*(em|ex|px|in|cm|mm|pt|pc|%)/;
  var normalize = function (str) {
    var ar;
    if ((ar = re.exec(str.toLowerCase()))) {
      return ar[1] + ar[2];
    }
    return null;
  };
  Drupal.gmap.addHandler('width', function (elem) {
    var obj = this;
    var binding = obj.bind('widthchange', function (w) {
      elem.value = normalize(w);
    });
    jQuery(elem).change(function () {
      var n;
      if ((n = normalize(elem.value))) {
        elem.value = n;
        obj.change('widthchange', binding, n);
      }
    });
    obj.bind('init', function () {
      jQuery(elem).change();
    });
  });
  Drupal.gmap.addHandler('height', function (elem) {
    var obj = this;
    var binding = obj.bind('heightchange', function (h) {
      elem.value = normalize(h);
    });
    jQuery(elem).change(function () {
      var n;
      if ((n = normalize(elem.value))) {
        elem.value = n;
        obj.change('heightchange', binding, n);
      }
    });
    obj.bind('init', function () {
      jQuery(elem).change();
    });
  });
})();
Drupal.gmap.addHandler('controltype', function (elem) {
  var obj = this;
  var binding = obj.bind('controltypechange', function () {
    elem.value = obj.vars.controltype;
  });
  jQuery(elem).change(function () {
    obj.vars.controltype = elem.value;
    obj.change('controltypechange', binding);
  });
});
Drupal.behaviors.GMap = {
  attach: function (context, settings) {
    if (Drupal.settings && Drupal.settings['gmap_remap_widgets']) {
      jQuery.each(Drupal.settings['gmap_remap_widgets'], function (key, val) {
        jQuery('#' + key).addClass('gmap-control');
      });
    }
    jQuery('.gmap-gmap:not(.gmap-processed)', context)
      .addClass('gmap-processed')
      .each(function () {
        Drupal.gmap.setup.call(this);
      });
    jQuery('.gmap-control:not(.gmap-processed)', context)
      .addClass('gmap-processed')
      .each(function () {
        Drupal.gmap.setup.call(this);
      });
  },
  detach: function (context, settings) {
    jQuery('.gmap-processed', context)
      .each(function (element) {
        var id = jQuery(this).attr('id');
        var mapid = id.split('-', 2);
        Drupal.gmap.unloadMap(mapid[1]);
      })
      .removeClass('gmap-processed');
  },
};
