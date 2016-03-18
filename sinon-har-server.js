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
  function load (server, harFile) {
    var responses = {};
    var traffic = harFile.log.entries;
    for (var i = 0; i < traffic.length; ++i) {
      var exchange = traffic[i];
      responses[exchange.request.url.href] = exchange.response;
    }
    server.respondWith(function (request) {
      var response = responses[request.url];
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
