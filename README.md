# sinon-har-server
Auto mocks your server from a recorded .har file. Don't let your mocks lie to you!

[![Build Status](https://travis-ci.org/larsthorup/sinon-har-server.png)](https://travis-ci.org/larsthorup/sinon-har-server)
[![Coverage Status](https://coveralls.io/repos/larsthorup/sinon-har-server/badge.svg?branch=master&service=github)](https://coveralls.io/github/larsthorup/sinon-har-server?branch=master)
[![Dependency Status](https://david-dm.org/larsthorup/sinon-har-server.png)](https://david-dm.org/larsthorup/sinon-har-server#info=dependencies)
[![devDependency Status](https://david-dm.org/larsthorup/sinon-har-server/dev-status.png)](https://david-dm.org/larsthorup/sinon-har-server#info=devDependencies)
[![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square)](https://github.com/Flet/semistandard)

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