Drupal.gmap.addHandler('gmap', function (elem) {
  var obj = this;
  var infowindow;
  if (obj.vars.styleBubble && obj.vars.styleBubble.enableBubbleStyle == 1) {
    infowindow = new InfoBubble(obj.vars.styleBubble.styleBubbleOptions);
  } else {
    infowindow = new google.maps.InfoWindow();
  }
  obj.bind('init', function () {
    if (obj.vars.behavior.autozoom) {
      obj.bounds = new google.maps.LatLngBounds();
    }
  });
  obj.bind('addmarker', function (marker) {
    marker.opts.position = new google.maps.LatLng(marker.latitude, marker.longitude);
    marker.opts.map = obj.map;
    var m = Drupal.gmap.factory.marker(marker.opts);
    marker.marker = m;
    google.maps.event.addListener(m, 'click', function () {
      obj.change('clickmarker', -1, marker);
    });
    if (obj.vars.behavior.extramarkerevents) {
      google.maps.event.addListener(m, 'mouseover', function () {
        obj.change('mouseovermarker', -1, marker);
      });
      google.maps.event.addListener(m, 'mouseout', function () {
        obj.change('mouseoutmarker', -1, marker);
      });
      google.maps.event.addListener(m, 'dblclick', function () {
        obj.change('dblclickmarker', -1, marker);
      });
    }
    if (marker.autoclick || (marker.options && marker.options.autoclick)) {
      obj.deferChange('clickmarker', -1, marker);
    }
    if (obj.vars.behavior.autozoom) {
      obj.bounds.extend(new google.maps.LatLng(marker.latitude, marker.longitude));
    }
  });
  obj.bind('clickmarker', function (marker) {
    if (infowindow !== null) {
      infowindow.close();
    }
    if (marker.text) {
      infowindow.setContent(marker.text);
      infowindow.open(obj.map, marker.marker);
    } else if (marker.iwq || (obj.vars.iwq && typeof marker.iwo != 'undefined')) {
      var iwq, iwo;
      if (obj.vars.iwq) {
        iwq = obj.vars.iwq;
      }
      if (marker.iwq) {
        iwq = marker.iwq;
      }
      iwo = 0;
      if (marker.iwo) {
        iwo = marker.iwo;
      }
      var el = document.createElement('div');
      jQuery(iwq).eq(iwo).clone(false).find('*').removeAttr('id').appendTo(jQuery(el));
      infowindow.setContent(el);
      infowindow.open(obj.map, marker.marker);
    } else if (marker.rmt) {
      infowindow.setContent('<div class="gmap-marker-rmt-loading throbber">Loading</div>');
      infowindow.open(obj.map, marker.marker);
      var uri = marker.rmt;
      if (obj.vars.rmtcallback) {
        uri = Drupal.absoluteUrl(obj.vars.rmtcallback + '/' + marker.rmt);
      }
      jQuery.get(uri, {}, function (data) {
        infowindow.setContent(data);
        infowindow.open(obj.map, marker.marker);
      });
    } else if (marker.tabs) {
      var data = '';
      for (var m in marker.tabs) {
        data += marker.tabs[m];
      }
      infowindow.setContent(data);
      infowindow.open(obj.map, marker.marker);
    } else if (marker.link) {
      open(marker.link, '_self');
    }
  });
  obj.bind('markersready', function () {
    if (obj.vars.behavior.autozoom) {
      if (!obj.bounds.isEmpty()) {
        obj.map.fitBounds(obj.bounds);
        var listener = google.maps.event.addListener(obj.map, 'idle', function () {
          if (obj.vars.maxzoom) {
            var maxzoom = parseInt(obj.vars.maxzoom);
            if (obj.map.getZoom() > maxzoom) obj.map.setZoom(maxzoom);
            google.maps.event.removeListener(listener);
          }
        });
      }
    }
  });
  obj.bind('clearmarkers', function () {
    if (obj.vars.behavior.autozoom) {
      obj.bounds = new google.maps.LatLngBounds();
    }
  });
  Drupal.gmap.getInfoWindow = function () {
    return infowindow;
  };
});
