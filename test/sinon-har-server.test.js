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
            request: { method: 'GET', url: { href: 'someUrl' } },
            response: { status: 200, content: { text: 'someUrlResponse' } }
          },
          {
            request: { method: 'POST', url: { href: 'storeThis' }, headers: [ { name: 'accept-version', value: '0.1.0' } ] },
            response: { status: 200, content: { text: 'success' } }
          }
        ]
      }
    };
    sinonHarServer.load(server, harFile);
    responder = server.respondWith.getCall(0).args[0];
  });

  it('should respond successfully', function () {
    var response = request({
      method: 'GET',
      url: 'someUrl'
    });
    response.should.deep.equal([200, {}, 'someUrlResponse']);
  });

  it('should match on accept-version header', function () {
    var response = request({
      method: 'POST',
      url: 'storeThis',
      headers: {
        'accept-version': '0.1.0'
      }
    });
    response.should.deep.equal([200, {}, 'success']);
  });

  it('should respond with 404 when method does not match', function () {
    var response = request({
      method: 'POST',
      url: 'someUrl'
    });
    response.should.deep.equal([404, {}, '{"message":"Not Found"}']);
  });

  it('should respond with 404 when url does not match', function () {
    var response = request({
      url: 'missingUrl'
    });
    response[0].should.equal(404);
  });

  it('should respond with 404 when accept-version does not match', function () {
    var response = request({
      method: 'POST',
      url: 'storeThis',
      headers: {
        'accept-version': '0.2.0'
      }
    });
    response[0].should.equal(404);
  });
});
