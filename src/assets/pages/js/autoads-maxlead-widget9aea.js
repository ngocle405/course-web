﻿var _0x39e9 = [
  'GetScript\x20Error:\x20',
  'stringify',
  'Get\x20script\x20tag\x20not\x20found',
  'json',
  'type',
  'animate',
  'onreadystatechange',
  'firstLoad',
  'src',
  'error',
  'createElement',
  'jQuery\x20version:\x20',
  'jquery',
  'log',
  'readyState',
  'preview',
  'location',
  'head',
  'dev_or_alpha',
  'IsActiveAIForCFP',
  'statusText',
  'https://alpha2.autoads.asia/js/autoads-tracking.js',
  'Load\x20inside\x20preview.\x20Return',
  'documentElement',
  'onload',
  'open',
  'search',
  'GetScript\x20OK:\x20',
  'substring',
  'amlGetURLParameter\x20Error:\x20',
  'amlParseQueryString\x20Error:\x20',
  'true',
  '&preview=',
  'https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js',
  'script',
  'appendChild',
  'function',
  'status',
  'noConflict',
  'AutoAdsPushNotifyNoneSDK.js',
  '⚡[AutoAds.Asia]⚡--[type]--MaxLead__',
  'aml_preview',
  'response',
  'split',
  'undefined',
  'business_id',
  'scriptUrl',
  'amlDynamicLoadScript\x20Error:\x20',
  'setAttribute',
  'pushConfig',
  'production',
  'info',
  'getElementById',
  'https://cdn.autoads.asia',
  'amlSDKInit\x20Error:\x20',
  'Load\x20multipe.\x20Return',
  'Init:\x20',
  'complete',
  '[type]',
  'replace',
  'POST',
  'length',
  'https://betacdn.autoads.asia',
];
(function (_0x175005, _0x52412e) {
  var _0x39e909 = function (_0x8f5c1b) {
    while (--_0x8f5c1b) {
      _0x175005['push'](_0x175005['shift']());
    }
  };
  _0x39e909(++_0x52412e);
})(_0x39e9, 0x138);
var _0x8f5c = function (_0x175005, _0x52412e) {
  _0x175005 = _0x175005 - 0x67;
  var _0x39e909 = _0x39e9[_0x175005];
  return _0x39e909;
};
var _0x10806f = _0x8f5c,
  aml_prefix = _0x10806f(0x92),
  aml_deploy_version = { dev_or_alpha: '', beta: '', production: _0x10806f(0x89) },
  aml_is_dev = aml_deploy_version[_0x10806f(0x7c)],
  aml_api_url = aml_is_dev
    ? '//alphacdn.autoads.asia'
    : aml_deploy_version['beta']
    ? _0x10806f(0x69)
    : aml_deploy_version['production']
    ? 'https://api.autoads.asia/maxlead'
    : '',
  jQueryautoAdsMaxLead,
  aml_widget = {};
aml_widget[_0x10806f(0x71)] = aml_widget['firstLoad'] || ![];
function amlSDKInit() {
  var _0x57760a = _0x10806f;
  try {
    var _0x4ed916 = amlParseQueryString();
    if (!_0x4ed916) {
      amlConsole[_0x57760a(0x73)]('Get\x20parameter\x20null');
      return;
    }
    amlConsole[_0x57760a(0x9d)](_0x57760a(0xa2) + JSON[_0x57760a(0x6b)](_0x4ed916));
    var _0x3532c1 =
        aml_api_url +
        '/api/Gateway/GetScript?business_id=' +
        _0x4ed916[_0x57760a(0x97)] +
        _0x57760a(0x8a) +
        (_0x4ed916[_0x57760a(0x79)] === _0x57760a(0x89)),
      _0x4343ea = new XMLHttpRequest();
    _0x4343ea[_0x57760a(0x83)](_0x57760a(0x67), _0x3532c1),
      _0x4343ea['send'](),
      (_0x4343ea['responseType'] = _0x57760a(0x6d)),
      (_0x4343ea['onload'] = function () {
        var _0x554cda = _0x57760a;
        if (_0x4343ea[_0x554cda(0x8f)] != 0xc8) {
          amlConsole[_0x554cda(0x73)](
            'GetScript\x20Error:\x20' + _0x4343ea['status'] + '-' + _0x4343ea[_0x554cda(0x7e)]
          );
          return;
        }
        var _0x56ea39 = _0x4343ea[_0x554cda(0x94)];
        if (aml_is_dev) amlConsole[_0x554cda(0x9d)](_0x554cda(0x85) + _0x56ea39);
        amlDynamicLoadScript(_0x56ea39[_0x554cda(0x98)]['replace'](/"/g, ''));
        var _0x1686c8 = aml_deploy_version[_0x554cda(0x9c)] ? _0x554cda(0x9f) : aml_api_url,
          _0x467aea = _0x554cda(0x7f);
        amlDynamicLoadScript(_0x467aea);
        var _0x3186ac =
          _0x1686c8 +
          '/PushNotification/' +
          (_0x56ea39['pushConfig']['IsUsingSDK'] ? 'AutoAdsPushNotify.js' : _0x554cda(0x91));
        amlDynamicLoadScript(_0x3186ac);
        if (_0x56ea39['pushConfig'][_0x554cda(0x7d)])
          amlDynamicLoadScript(
            _0x1686c8 + '/cfp/autoads-ai.js?active_ai=' + _0x56ea39[_0x554cda(0x9b)]['IsActiveAIForCFP']
          );
      }),
      (_0x4343ea['onerror'] = function () {
        var _0x397f7a = _0x57760a;
        amlConsole[_0x397f7a(0x73)](_0x397f7a(0x6a) + JSON[_0x397f7a(0x6b)](_0x4343ea));
      });
  } catch (_0x16d6ff) {
    amlConsole[_0x57760a(0x73)](_0x57760a(0xa0) + _0x16d6ff);
  }
}
function amlDynamicLoadScript(_0x4ab11c, _0x18811c) {
  var _0x2536d5 = _0x10806f;
  try {
    var _0x41cd1f = document[_0x2536d5(0x74)](_0x2536d5(0x8c));
    _0x41cd1f['setAttribute'](_0x2536d5(0x6e), 'text/javascript'),
      _0x41cd1f[_0x2536d5(0x9a)](_0x2536d5(0x72), _0x4ab11c),
      (document['getElementsByTagName'](_0x2536d5(0x7b))[0x0] || document[_0x2536d5(0x81)])[_0x2536d5(0x8d)](_0x41cd1f);
    if (typeof _0x18811c === 'function') {
      if (_0x41cd1f['readyState'])
        _0x41cd1f[_0x2536d5(0x70)](function () {
          var _0xb7ae98 = _0x2536d5;
          if (this[_0xb7ae98(0x78)] == _0xb7ae98(0xa3) || this[_0xb7ae98(0x78)] == 'loaded') _0x18811c();
        });
      else _0x41cd1f[_0x2536d5(0x82)] = _0x18811c;
    }
  } catch (_0x4504fc) {
    amlConsole['error'](_0x2536d5(0x99) + _0x4504fc);
  }
}
function amlParseQueryString() {
  var _0x318690 = _0x10806f;
  try {
    var _0x53e0f0 = document[_0x318690(0x9e)]('autoAdsMaxLead-widget-script');
    if (!_0x53e0f0) {
      amlConsole[_0x318690(0x73)](_0x318690(0x6c));
      return;
    }
    var _0x2ac12a = _0x53e0f0[_0x318690(0x72)][_0x318690(0xa5)](/^[^\?]+\??/, ''),
      _0x25595d = _0x2ac12a['split']('&'),
      _0x2b0bf0 = _0x25595d[_0x318690(0x68)],
      _0xe18a73 = {};
    for (var _0x1ea8e4 = 0x0; _0x1ea8e4 < _0x2b0bf0; _0x1ea8e4++) {
      var _0x4470fd = _0x25595d[_0x1ea8e4]['split']('=');
      _0xe18a73[_0x4470fd[0x0]] = decodeURI(_0x4470fd[0x1])[_0x318690(0xa5)](/\+/g, '\x20');
    }
    return _0xe18a73;
  } catch (_0x5efa07) {
    amlConsole[_0x318690(0x73)](_0x318690(0x88) + _0x5efa07);
  }
}
function amlGetURLParameter(_0xa7f347) {
  var _0x1eb949 = _0x10806f;
  try {
    var _0x5667fc = window[_0x1eb949(0x7a)][_0x1eb949(0x84)][_0x1eb949(0x86)](0x1),
      _0x4dd6e0 = _0x5667fc[_0x1eb949(0x95)]('&');
    for (var _0x222fe1 = 0x0; _0x222fe1 < _0x4dd6e0[_0x1eb949(0x68)]; _0x222fe1++) {
      var _0x39c697 = _0x4dd6e0[_0x222fe1][_0x1eb949(0x95)]('=');
      if (_0x39c697[0x0] == _0xa7f347) return _0x39c697[0x1];
    }
    return '';
  } catch (_0x4d74d4) {
    return amlConsole[_0x1eb949(0x73)](_0x1eb949(0x87) + _0x4d74d4), '';
  }
}
var amlConsole = {
  info: function (_0x188866) {
    var _0x3a609e = _0x10806f;
    console[_0x3a609e(0x77)](aml_prefix[_0x3a609e(0xa5)](_0x3a609e(0xa4), '🙂') + _0x188866);
  },
  error: function (_0x10e55d) {
    var _0x3f28b4 = _0x10806f;
    console['log'](aml_prefix[_0x3f28b4(0xa5)]('[type]', '😈') + _0x10e55d);
  },
};
setTimeout(function () {
  var _0x134686 = _0x10806f;
  if (amlGetURLParameter(_0x134686(0x93)) !== '') {
    amlConsole[_0x134686(0x9d)](_0x134686(0x80));
    return;
  }
  if (aml_widget[_0x134686(0x71)]) {
    amlConsole[_0x134686(0x73)](_0x134686(0xa1));
    return;
  }
  aml_widget[_0x134686(0x71)] = !![];
  var _0xf1156a = typeof jQuery === _0x134686(0x96);
  if (!_0xf1156a) {
    var _0x19284c = jQuery['fn'][_0x134686(0x76)][_0x134686(0x95)]('\x20')[0x0]['split']('.');
    ((_0x19284c[0x0] < 0x2 && _0x19284c[0x1] < 0x9) ||
      (_0x19284c[0x0] == 0x1 && _0x19284c[0x1] == 0x9 && _0x19284c[0x2] < 0x1) ||
      _0x19284c[0x0] > 0x3 ||
      typeof jQuery['fn'][_0x134686(0x6f)] !== _0x134686(0x8e) ||
      typeof jQuery['fn']['fadeIn'] !== _0x134686(0x8e)) &&
      ((_0xf1156a = !![]), amlConsole['info'](_0x134686(0x75) + _0x19284c));
  }
  if (_0xf1156a) {
    amlDynamicLoadScript(_0x134686(0x8b), function () {
      var _0x5a740d = _0x134686;
      (jQueryautoAdsMaxLead = jQuery[_0x5a740d(0x90)](!![])), amlSDKInit();
    });
    return;
  }
  (jQueryautoAdsMaxLead = jQuery), amlSDKInit();
}, 0xa0);
