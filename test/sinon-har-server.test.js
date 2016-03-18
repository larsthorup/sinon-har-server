/* eslint-env mocha */

var sinon = require('sinon');
var sinonHarServer = require('../sinon-har-server');

describe('sinon-har-server', function () {
  var responder;

  function request (options) {
    Object.assign(options, {
      respond: sinon.spy()
    });
    responder(options);
    return options.respond.getCall(0).args;
  }

  beforeEach(function () {
    var server = {
      respondWith: sinon.spy()
    };
    var harFile = {
      log: {
        entries: [
          {
            request: { url: { href: 'someUrl' } },
            response: { status: 200, content: { text: 'someUrlResponse' } }
          }
        ]
      }
    };
    sinonHarServer.load(server, harFile);
    responder = server.respondWith.getCall(0).args[0];
  });

  it('should respond successfully', function () {
    var response = request({
      url: 'someUrl'
    });
    response.should.deep.equal([200, {}, 'someUrlResponse']);
  });

  it('should respond with 404 when not found', function () {
    var response = request({
      url: 'missingUrl'
    });
    response.should.deep.equal([404, {}, '{"message":"Not Found"}']);
  });
});
