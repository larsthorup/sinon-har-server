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
  function buildKey (method, url, acceptVersion, authorization, body) {
    return [method, url, acceptVersion, authorization, body].join(':');
  }

  function getHarHeader (headers, name) {
    if (!headers) return null;
    for (let i = 0; i < headers.length; ++i) {
      const header = headers[i];
      if (header.name === name) return header.value;
    }
    return null;
  }

  function getHeader (headers, name) {
    if (!headers) return null;
    return headers[name];
  }

  function load (server, harFile) {
    const responses = {};
    const traffic = harFile.log.entries;
    for (let i = 0; i < traffic.length; ++i) {
      const exchange = traffic[i];
      const method = exchange.request.method;
      const url = exchange.request.url.href;
      const acceptVersion = getHarHeader(exchange.request.headers, 'accept-version') || '-';
      const authorization = getHarHeader(exchange.request.headers, 'authorization') || '-';
      const body = exchange.request.postData ? exchange.request.postData.text : '-';
      const key = buildKey(method, url, acceptVersion, authorization, body);
      responses[key] = exchange.response;
    }
    server.respondWith(function (request) {
      const method = request.method;
      const url = request.url;
      const acceptVersion = getHeader(request.requestHeaders, 'Accept-Version') || '-';
      const authorization = getHeader(request.requestHeaders, 'Authorization') || '-';
      const body = request.requestBody ? request.requestBody : '-';
      const key = buildKey(method, url, acceptVersion, authorization, body);
      const response = responses[key];
      if (response) {
        request.respond(response.status, {}, response.content.text);
      } else {
        request.respond(404, {}, JSON.stringify({ message: 'Not Found: ' + key }));
      }
    });
  }

  return {
    load: load
  };
}));
