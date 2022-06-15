Drupal.gmap.addHandler('gmap', function (elem) {
  var obj = this;
  var marker, i;
  if (obj.vars.markers) {
    obj.bind('iconsready', function () {
      for (i = 0; i < obj.vars.markers.length; i++) {
        marker = obj.vars.markers[i];
        if (!marker.opts) {
          marker.opts = {};
        }
        obj.change('preparemarker', -1, marker);
        if (marker && marker.marker == undefined) {
          obj.change('addmarker', -1, marker);
        }
      }
      obj.change('markersready', -1);
    });
  }
});
