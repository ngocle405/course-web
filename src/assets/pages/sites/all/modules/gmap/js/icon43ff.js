Drupal.gmap.getIcon = function (setname, sequence) {
  var othimg = ['printImage', 'mozPrintImage', 'printShadow', 'transparent'];
  if (!setname) {
    return;
  }
  if (!this.gicons) {
    this.gicons = {};
  }
  if (!this.gshadows) {
    this.gshadows = {};
  }
  if (!sequence) {
    if (!this.sequences) {
      this.sequences = {};
    }
    if (!this.sequences[setname]) {
      this.sequences[setname] = -1;
    }
    this.sequences[setname]++;
    sequence = this.sequences[setname];
  }
  if (!this.gicons[setname]) {
    if (!Drupal.gmap.icons[setname]) {
      alert('Request for invalid marker set ' + setname + '!');
    }
    this.gicons[setname] = [];
    this.gshadows[setname] = [];
    var q = Drupal.gmap.icons[setname];
    var p, t;
    for (var i = 0; i < q.sequence.length; i++) {
      p = Drupal.settings.basePath + q.path;
      t = new google.maps.MarkerImage(
        p + q.sequence[i].f,
        new google.maps.Size(q.sequence[i].w, q.sequence[i].h),
        null,
        new google.maps.Point(q.anchorX, q.anchorY)
      );
      if (q.scale > 1) {
        t.scaledSize = new google.maps.Size(q.sequence[i].w / q.scale, q.sequence[i].h / q.scale);
      }
      if (q.shadow.f !== '') {
        this.gshadows[setname][i] = new google.maps.MarkerImage(
          p + q.shadow.f,
          new google.maps.Size(q.shadow.w, q.shadow.h),
          null,
          new google.maps.Point(q.anchorX, q.anchorY)
        );
      } else {
        this.gshadows[setname][i] = null;
      }
      for (var j = 0; j < othimg.length; j++) {
        if (q[othimg[j]] !== '') {
          t[othimg[j]] = p + q[othimg[j]];
        }
      }
      this.gicons[setname][i] = t;
    }
    delete Drupal.gmap.icons[setname];
  }
  return this.gicons[setname][sequence % this.gicons[setname].length];
};
Drupal.gmap.getShadow = function (setname, sequence) {
  if (this.gshadows) return this.gshadows[setname][sequence % this.gicons[setname].length];
};
Drupal.gmap.iconSetup = function () {
  Drupal.gmap.icons = {};
  var m = Drupal.gmap.icondata;
  var filef, filew, fileh, files;
  for (var path in m) {
    if (m.hasOwnProperty(path)) {
      filef = m[path].f;
      filew = Drupal.gmap.expandArray(m[path].w, filef.length);
      fileh = Drupal.gmap.expandArray(m[path].h, filef.length);
      files = [];
      for (var i = 0; i < filef.length; i++) {
        files[i] = { f: filef[i], w: filew[i], h: fileh[i] };
      }
      for (var ini in m[path].i) {
        if (m[path].i.hasOwnProperty(ini)) {
          jQuery.extend(Drupal.gmap.icons, Drupal.gmap.expandIconDef(m[path].i[ini], path, files));
        }
      }
    }
  }
};
Drupal.gmap.expandArray = function (arr, len) {
  var d = arr[0];
  for (var i = 0; i < len; i++) {
    if (!arr[i]) {
      arr[i] = d;
    } else {
      d = arr[i];
    }
  }
  return arr;
};
Drupal.gmap.expandIconDef = function (c, path, files) {
  var decomp = [
    'key',
    'name',
    'sequence',
    'anchorX',
    'anchorY',
    'infoX',
    'infoY',
    'scale',
    'shadow',
    'printImage',
    'mozPrintImage',
    'printShadow',
    'transparent',
  ];
  var fallback = ['', '', [], 0, 0, 0, 0, 0, { f: '', h: 0, w: 0 }, '', '', '', ''];
  var imagerep = ['shadow', 'printImage', 'mozPrintImage', 'printShadow', 'transparent'];
  var defaults = {};
  var sets = [];
  var i, j;
  for (i = 0; i < decomp.length; i++) {
    if (!c[0][i]) {
      c[0][i] = [fallback[i]];
    }
    c[0][i] = Drupal.gmap.expandArray(c[0][i], c[0][0].length);
  }
  for (i = 0; i < c[0][0].length; i++) {
    for (j = 0; j < decomp.length; j++) {
      if (i === 0) {
        defaults[decomp[j]] = c[0][j][i];
      } else {
        if (!sets[i - 1]) {
          sets[i - 1] = {};
        }
        sets[i - 1][decomp[j]] = c[0][j][i];
      }
    }
  }
  for (i = 0; i < sets.length; i++) {
    for (j = 0; j < decomp.length; j++) {
      if (sets[i][decomp[j]] === fallback[j]) {
        sets[i][decomp[j]] = defaults[decomp[j]];
      }
    }
  }
  var icons = {};
  for (i = 0; i < sets.length; i++) {
    var key = sets[i].key;
    icons[key] = sets[i];
    icons[key].path = path;
    delete icons[key].key;
    delete sets[i];
    for (j = 0; j < icons[key].sequence.length; j++) {
      icons[key].sequence[j] = files[icons[key].sequence[j]];
    }
    for (j = 0; j < imagerep.length; j++) {
      if (typeof icons[key][imagerep[j]] === 'number') {
        icons[key][imagerep[j]] = files[icons[key][imagerep[j]]];
      }
    }
  }
  return icons;
};
Drupal.gmap.addHandler('gmap', function (elem) {
  var obj = this;
  obj.bind('init', function () {
    if (!Drupal.gmap.icons) {
      Drupal.gmap.iconSetup();
    }
  });
  obj.bind('ready', function () {
    if (Drupal.gmap.icondata) {
      obj.deferChange('iconsready', -1);
    }
  });
  obj.bind('preparemarker', function (marker) {
    if (!obj.vars.behavior.customicons || (marker.markername && !marker.opts.icon)) {
      marker.opts.icon = Drupal.gmap.getIcon(marker.markername, marker.offset);
      marker.opts.shadow = Drupal.gmap.getShadow(marker.markername, marker.offset);
    }
  });
});
