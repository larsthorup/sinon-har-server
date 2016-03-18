# sinon-har-server
Auto mocks your server from a recorded .har file. Don't let your mocks lie to you!

This module works in Node.js as well as in the browser with either AMD or with a ```<script>``` tag which defines ```sinonHarServer``` as a global.

Usage:

    var server;
    
    beforeEach(function () {
      return fetch('api-traffic.har').then(function (response) {
        return response.json();
      }).then(function (harFile) {
        server = sinon.fakeServer.create();
        server.autoRespond = true;
        server.autoRespondAfter = 1;
        return sinonHarServer.load(server, harFile);
      });
    });
    
    afterEach(function () {
      server.restore();
    });


The .har file can be conveniently produced by https://github.com/larsthorup/node-request-har-capture