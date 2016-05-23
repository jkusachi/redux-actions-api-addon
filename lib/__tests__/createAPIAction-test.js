'use strict';

var _ = require('../');

var _fluxStandardAction = require('flux-standard-action');

describe('createAPIAction()', function () {
  describe('resulting action creator', function () {
    var type = 'TYPE';

    it('returns a valid FSA', function () {
      var actionCreator = (0, _.createAPIAction)(type, 'GET', '/sample', function (b) {
        return b;
      });
      var action = actionCreator();
      expect((0, _fluxStandardAction.isFSA)(action)).to.be.true;
    });

    it('uses return value as payload', function () {
      var actionCreator = (0, _.createAPIAction)(type, 'GET', '/sample', function (b) {
        return b;
      }, function (b) {
        return b;
      });
      var action = actionCreator();
      expect(action).to.deep.equal({
        type: type,
        payload: {},
        meta: {
          api: true,
          method: 'GET',
          endpoint: '/sample',
          types: [type.concat('_GET_REQUEST'), type.concat('_GET_SUCCESS'), type.concat('_GET_FAILURE')]
        }
      });
    });

    it('uses identity function if actionCreator is not a function', function () {
      var actionCreator = (0, _.createAPIAction)(type, 'POST', '/sample');
      var foobar = { foo: 'bar' };
      var action = actionCreator(foobar);
      expect(action).to.deep.equal({
        type: type,
        payload: foobar,
        meta: {
          api: true,
          method: 'POST',
          endpoint: '/sample',
          types: [type.concat('_POST_REQUEST'), type.concat('_POST_SUCCESS'), type.concat('_POST_FAILURE')]
        }
      });
      expect((0, _fluxStandardAction.isFSA)(action)).to.be.true;
    });

    it('accepts a second parameter for adding meta to object', function () {
      var actionCreator = (0, _.createAPIAction)(type, 'POST', '/sample', null, function (_ref) {
        var cid = _ref.cid;
        return { cid: cid };
      });
      var foobar = { foo: 'bar', cid: 5 };
      var action = actionCreator(foobar);
      expect(action).to.deep.equal({
        type: type,
        payload: foobar,
        meta: {
          api: true,
          method: 'POST',
          endpoint: '/sample',
          cid: 5,
          types: [type.concat('_POST_REQUEST'), type.concat('_POST_SUCCESS'), type.concat('_POST_FAILURE')]
        }
      });
      expect((0, _fluxStandardAction.isFSA)(action)).to.be.true;
    });

    it('sets error to true if payload is an Error object', function () {
      var actionCreator = (0, _.createAPIAction)(type, 'GET', '/sample');
      var errObj = new TypeError('this is an error');

      var errAction = actionCreator(errObj);
      expect(errAction).to.deep.equal({
        type: type,
        payload: errObj,
        error: true,
        meta: {
          api: true,
          method: 'GET',
          endpoint: '/sample',
          types: [type.concat('_GET_REQUEST'), type.concat('_GET_SUCCESS'), type.concat('_GET_FAILURE')]
        }
      });
      expect((0, _fluxStandardAction.isFSA)(errAction)).to.be.true;

      var actionCreatorPost = (0, _.createAPIAction)(type, 'POST', '/sample');
      var foobar = { foo: 'bar', cid: 5 };
      var noErrAction = actionCreatorPost(foobar);
      expect(noErrAction).to.deep.equal({
        type: type,
        payload: foobar,
        meta: {
          api: true,
          method: 'POST',
          endpoint: '/sample',
          types: [type.concat('_POST_REQUEST'), type.concat('_POST_SUCCESS'), type.concat('_POST_FAILURE')]
        }
      });
      expect((0, _fluxStandardAction.isFSA)(noErrAction)).to.be.true;
    });

    it('test GET endoint, ALL elements', function () {
      var getItems = (0, _.createAPIAction)(type, 'GET', '/sample', function (b) {
        return b;
      }, function (b) {
        return b;
      });
      expect(getItems()).to.deep.equal({
        type: type,
        payload: {},
        meta: {
          api: true,
          method: 'GET',
          endpoint: '/sample',
          types: [type.concat('_GET_REQUEST'), type.concat('_GET_SUCCESS'), type.concat('_GET_FAILURE')]
        }
      });
    });

    it('test POST Data endpoint', function () {
      var createItems = (0, _.createAPIAction)(type, 'POST', '/sample');
      var postData = { name: 'james' };
      expect(createItems(postData)).to.deep.equal({
        type: type,
        payload: postData,
        meta: {
          api: true,
          method: 'POST',
          endpoint: '/sample',
          types: [type.concat('_POST_REQUEST'), type.concat('_POST_SUCCESS'), type.concat('_POST_FAILURE')]
        }
      });
    });

    it('test PUT Data endpoint', function () {
      var updateItems = (0, _.createAPIAction)(type, 'PUT', '/sample');
      var postID = 10;
      var postData = { name: 'james' };
      expect(updateItems(postID, postData)).to.deep.equal({
        type: type,
        payload: postData,
        meta: {
          api: true,
          method: 'PUT',
          endpoint: '/sample/10',
          types: [type.concat('_PUT_REQUEST'), type.concat('_PUT_SUCCESS'), type.concat('_PUT_FAILURE')]
        }
      });
    });

    it('test DELETE Data endpoint', function () {
      var deleteItems = (0, _.createAPIAction)(type, 'DELETE', '/sample');
      var postID = 5;
      expect(deleteItems(postID)).to.deep.equal({
        type: type,
        payload: {},
        meta: {
          api: true,
          method: 'DELETE',
          endpoint: '/sample/5',
          types: [type.concat('_DELETE_REQUEST'), type.concat('_DELETE_SUCCESS'), type.concat('_DELETE_FAILURE')]
        }
      });
    });
  });

  describe('Testing Custom Endpoints', function () {
    var type = 'TYPE';
    it('test GET with Custom Endpoint', function () {
      var customEndpoint = function customEndpoint() {
        return '/tester/mctesterson';
      };
      var getItems = (0, _.createAPIAction)(type, 'GET', customEndpoint);
      expect(getItems()).to.deep.equal({
        type: type,
        payload: {},
        meta: {
          api: true,
          method: 'GET',
          endpoint: '/tester/mctesterson',
          types: [type.concat('_GET_REQUEST'), type.concat('_GET_SUCCESS'), type.concat('_GET_FAILURE')]
        }
      });
    });

    it('test Get by ID with Custom Endpoint', function () {
      var customEndpoint = function customEndpoint(p) {
        return '/tester/' + p + '/mctesterson';
      };
      var getItems = (0, _.createAPIAction)(type, 'GET', customEndpoint);
      expect(getItems(10)).to.deep.equal({
        type: type,
        payload: 10,
        meta: {
          api: true,
          method: 'GET',
          endpoint: '/tester/10/mctesterson',
          types: [type.concat('_GET_REQUEST'), type.concat('_GET_SUCCESS'), type.concat('_GET_FAILURE')]
        }
      });
    });

    it('test POST with Custom Endpoint', function () {
      var customEndpoint = function customEndpoint(params) {
        return '/user/' + params.id + '/ronald/' + params.name;
      };
      var createItem = (0, _.createAPIAction)(type, 'POST', customEndpoint);
      var payload = { id: 10, name: 'james' };
      expect(createItem(payload)).to.deep.equal({
        type: type,
        payload: payload,
        meta: {
          api: true,
          method: 'POST',
          endpoint: '/user/10/ronald/james',
          types: [type.concat('_POST_REQUEST'), type.concat('_POST_SUCCESS'), type.concat('_POST_FAILURE')]
        }
      });
    });

    it('test PUT with Custom Endpoint', function () {
      var customEndpoint = function customEndpoint(params) {
        return '/user/' + params.id;
      };
      var updateItem = (0, _.createAPIAction)(type, 'PUT', customEndpoint);
      var payload = { id: 10, name: 'james' };
      expect(updateItem(payload)).to.deep.equal({
        type: type,
        payload: payload,
        meta: {
          api: true,
          method: 'PUT',
          endpoint: '/user/10',
          types: [type.concat('_PUT_REQUEST'), type.concat('_PUT_SUCCESS'), type.concat('_PUT_FAILURE')]
        }
      });
    });

    it('test DELETE with Custom Endpoint', function () {
      var customEndpoint = function customEndpoint(_ref2) {
        var id = _ref2.id;
        var accountID = _ref2.accountID;
        return '/user/' + id + '/account/' + accountID;
      };
      var deleteItem = (0, _.createAPIAction)(type, 'DELETE', customEndpoint);
      var payload = { id: 10, accountID: 25 };
      expect(deleteItem(payload)).to.deep.equal({
        type: type,
        payload: payload,
        meta: {
          api: true,
          method: 'DELETE',
          endpoint: '/user/10/account/25',
          types: [type.concat('_DELETE_REQUEST'), type.concat('_DELETE_SUCCESS'), type.concat('_DELETE_FAILURE')]
        }
      });
    });
  });
});