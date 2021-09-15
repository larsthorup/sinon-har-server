/* eslint-env mocha */

const sinon = require('sinon');
const sinonHarServer = require('../sinon-har-server');

describe('sinon-har-server', function () {
  let responder;

  function request (options) {
    Object.assign(options, {
      respond: sinon.spy()
    });
    responder(options);
    return options.respond.getCall(0).args;
  }

  beforeEach(function () {
    const server = {
      respondWith: sinon.spy()
    };
    const harFile = {
      log: {
        entries: [
          {
            request: { method: 'GET', url: { href: 'someUrl' } },
            response: { status: 200, content: { text: 'someUrlResponse' } }
          },
          {
            request: {
              method: 'POST',
              url: { href: 'storeThis' },
              headers: [
                { name: 'accept-version', value: '0.1.0' },
                { name: 'authorization', value: 'validAuth' }
              ],
              postData: {
                mimeType: 'application/json',
                text: '{"data":"somePostData"}'
              }
            },
            response: { status: 200, content: { text: 'success' } }
          },
          {
            request: {
              method: 'DELETE',
              url: { href: 'some-id' },
              headers: [
                { name: 'some-other-header', value: 'some-value' }
              ]
            },
            response: { status: 200, content: { text: 'success' } }
          }
        ]
      }
    };
    sinonHarServer.load(server, harFile);
    responder = server.respondWith.getCall(0).args[0];
  });

  it('should respond successfully', function () {
    const response = request({
      method: 'GET',
      url: 'someUrl'
    });
    response.should.deep.equal([200, {}, 'someUrlResponse']);
  });

  it('should match on accept-version header, authorization and request body', function () {
    const response = request({
      method: 'POST',
      url: 'storeThis',
      requestHeaders: {
        'Accept-Version': '0.1.0',
        Authorization: 'validAuth'
      },
      requestBody: '{"data":"somePostData"}'
    });
    response.should.deep.equal([200, {}, 'success']);
  });

  it('should respond with 404 when method does not match', function () {
    const response = request({
      method: 'POST',
      url: 'someUrl'
    });
    response.should.deep.equal([404, {}, '{"message":"Not Found: POST:someUrl:-:-:-"}']);
  });

  it('should respond with 404 when url does not match', function () {
    const response = request({
      url: 'missingUrl'
    });
    response[0].should.equal(404);
  });

  it('should respond with 404 when accept-version does not match', function () {
    const response = request({
      method: 'POST',
      url: 'storeThis',
      requestHeaders: {
        'Accept-Version': '0.2.0',
        Authorization: 'validAuth'
      },
      requestBody: '{"data":"somePostData"}'
    });
    response[0].should.equal(404);
  });

  it('should respond with 404 when request body does not match', function () {
    const response = request({
      method: 'POST',
      url: 'storeThis',
      requestHeaders: {
        'Accept-Version': '0.1.0',
        Authorization: 'validAuth'
      },
      requestBody: { data: 'someDifferentPostData' }
    });
    response[0].should.equal(404);
  });

  it('should respond with 404 when authorization header does not match', function () {
    const response = request({
      method: 'POST',
      url: 'storeThis',
      requestHeaders: {
        'Accept-Version': '0.1.0',
        Authorization: 'invalidAuth'
      },
      requestBody: '{"data":"somePostData"}'
    });
    response[0].should.equal(404);
  });
});
