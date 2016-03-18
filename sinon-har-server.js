/* eslint-env node, browser, amd */

(function (root, name, depNames, factory) {
  var deps = [];
  var i;
  if (typeof define === 'function' && define.amd) {
    define(depNames, factory);
  } else if (typeof module === 'object' && module.exports) {
    for (i = 0; i < depNames.length; ++i) {
      deps.push(require(depNames[i]));
    }
    module.exports = factory.apply(this, deps);
  } else {
    for (i = 0; i < depNames.length; ++i) {
      deps.push(root[depNames[i]]);
    }
    root[name] = factory.apply(this, deps);
  }
}(this, 'sinonHarServer', [], function () {
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
