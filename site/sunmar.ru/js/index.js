var log, queryParam, trouble;

window.ASAP = (function() {
  var callall, fns;
  fns = [];
  callall = function() {
    var f, results;
    results = [];
    while (f = fns.shift()) {
      results.push(f());
    }
    return results;
  };
  if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', callall, false);
    window.addEventListener('load', callall, false);
  } else if (document.attachEvent) {
    document.attachEvent('onreadystatechange', callall);
    window.attachEvent('onload', callall);
  }
  return function(fn) {
    fns.push(fn);
    if (document.readyState === 'complete') {
      return callall();
    }
  };
})();

log = function() {
  if (window.console && window.DEBUG) {
    if (typeof console.group === "function") {
      console.group(window.DEBUG);
    }
    if (arguments.length === 1 && Array.isArray(arguments[0]) && console.table) {
      console.table.apply(window, arguments);
    } else {
      console.log.apply(window, arguments);
    }
    return typeof console.groupEnd === "function" ? console.groupEnd() : void 0;
  }
};

trouble = function() {
  var ref;
  if (window.console) {
    if (window.DEBUG) {
      if (typeof console.group === "function") {
        console.group(window.DEBUG);
      }
    }
    if ((ref = console.warn) != null) {
      ref.apply(window, arguments);
    }
    if (window.DEBUG) {
      return typeof console.groupEnd === "function" ? console.groupEnd() : void 0;
    }
  }
};

window.preload = function(what, fn) {
  var lib;
  if (!Array.isArray(what)) {
    what = [what];
  }
  return $.when.apply($, (function() {
    var i, len1, results;
    results = [];
    for (i = 0, len1 = what.length; i < len1; i++) {
      lib = what[i];
      results.push($.ajax(lib, {
        dataType: 'script',
        cache: true
      }));
    }
    return results;
  })()).done(function() {
    return typeof fn === "function" ? fn() : void 0;
  });
};

window.queryParam = queryParam = function(p, nocase) {
  var k, params, params_kv;
  params_kv = location.search.substr(1).split('&');
  params = {};
  params_kv.forEach(function(kv) {
    var k_v;
    k_v = kv.split('=');
    return params[k_v[0]] = k_v[1] || '';
  });
  if (p) {
    if (nocase) {
      for (k in params) {
        if (k.toUpperCase() === p.toUpperCase()) {
          return decodeURIComponent(params[k]);
        }
      }
      return void 0;
    } else {
      return decodeURIComponent(params[p]);
    }
  }
  return params;
};

String.prototype.zeroPad = function(len, c) {
  var s;
  s = '';
  c || (c = '0');
  len || (len = 2);
  len -= this.length;
  while (s.length < len) {
    s += c;
  }
  return s + this;
};

Number.prototype.zeroPad = function(len, c) {
  return String(this).zeroPad(len, c);
};

ASAP(function() {
  var $scrollToReady, showCardWithSelector;
  $scrollToReady = $.Deferred();
  preload('https://cdnjs.cloudflare.com/ajax/libs/jquery-scrollTo/2.1.3/jquery.scrollTo.min.js', function() {
    $scrollToReady.resolve();
    return $(document).on('click', '[data-scrollto]', function() {
      return $(window).scrollTo($(this).data('scrollto'), 500, {
        interrupt: true,
        margin: true,
        offset: -50
      });
    });
  });
  showCardWithSelector = function($sel, clicked) {
    var $el2show, content_marker, idx;
    $sel.addClass('selected').siblings('.selected').removeClass('selected');
    content_marker = $sel.attr('data-show');
    idx = $sel.index();
    if (window.innerWidth > 768) {
      $("[data-content-for='" + content_marker + "']").slideDown().siblings().slideUp();
    } else {
      $el2show = $("[data-content-for='" + content_marker + "']");
      $el2show.show().siblings().hide();
      if (clicked) {
        $.when($scrollToReady).done(function() {
          return $(window).scrollTo($el2show, 500, {
            interrupt: true,
            margin: true,
            offset: -50
          });
        });
      }
    }
    return $('.accomodation-only a').attr({
      href: $sel.attr('data-acc-href')
    });
  };
  showCardWithSelector($('[data-show].selected'));
  return $('[data-show]').on('click', function() {
    return showCardWithSelector($(this), 'clicked');
  });
});
