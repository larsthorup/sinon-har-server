/* eslint-env node, browser, amd */

(function (root, name, factory) {
  /* istanbul ignore next */
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory.apply(this, []);
  } else {
    root[name] = factory.apply(this, []);
  }
}(this, 'sinonHarServer', function () {
  function buildKey (method, url, acceptVersion) {
    return [method, url, acceptVersion].join(':');
  }

  function getHarHeader (headers, name) {
    if (!headers) return null;
    for (var i = 0; i < headers.length; ++i) {
      var header = headers[i];
      if (header.name === name) return header.value;
    }
    return null;
  }

  function getHeader (headers, name) {
    if (!headers) return null;
    return headers[name];
  }

  function load (server, harFile) {
    var responses = {};
    var traffic = harFile.log.entries;
    for (var i = 0; i < traffic.length; ++i) {
      var exchange = traffic[i];
      var method = exchange.request.method;
      var url = exchange.request.url.href;
      var acceptVersion = getHarHeader(exchange.request.headers, 'accept-version') || '-';
      var key = buildKey(method, url, acceptVersion);
      responses[key] = exchange.response;
    }
    server.respondWith(function (request) {
      var method = request.method;
      var url = request.url;
      var acceptVersion = getHeader(request.headers, 'accept-version') || '-';
      var key = buildKey(method, url, acceptVersion);
      var response = responses[key];
      if (response) {
        request.respond(response.status, {}, response.content.text);
      } else {
        request.respond(404, {}, JSON.stringify({message: 'Not Found'}));
      }
    });
  }

  return {
    load: load
  };
}));
