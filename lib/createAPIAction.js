'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createAPIAction;

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

/**
 * Returns the endpoint based on HTTP Verb
 * Contains a specific case for GET BY ID because
 * the verb is the same as a GET ALL
**/
function getEndpoint(method, endpoint, params) {
  var _params = _toArray(params);

  var firstParam = _params[0];

  var others = _params.slice(1);

  if (typeof endpoint === 'function') {
    return endpoint(firstParam);
  }

  switch (method) {
    case 'DELETE':
    case 'PUT':
      return endpoint + '/' + firstParam;
    default:
      return endpoint;
  }
}

/**
 * in some cases, the payload is the first argument (POST)
 * in other cases, the first argument is the ID and the second
 * is the actual post data
 * We need to check and return accordingly.
 *
 * In an error case, we just return the error.
**/
function getPayload(method, endpoint, params) {
  var _params2 = _toArray(params);

  var firstParam = _params2[0];

  var others = _params2.slice(1);

  if (firstParam instanceof Error) {
    return firstParam;
  }

  if (typeof endpoint === 'function') {
    return firstParam || {};
  }

  switch (method) {
    case 'POST':
      return firstParam;
    case 'PUT':
      return others[0];
    default:
      return {};
  }
}

function createAPIAction(type, method, endpoint, actionCreator, metaCreator) {
  return function () {
    for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
      params[_key] = arguments[_key];
    }

    var firstParam = params[0];
    var others = params.slice(1);


    var finalEndpoint = getEndpoint(method, endpoint, params);

    var action = {
      type: type,
      payload: getPayload(method, endpoint, params)
    };

    if (action.payload instanceof Error) {
      // Handle FSA errors where the payload is an Error object. Set error.
      action.error = true;
      action.payload = firstParam;
    }

    if (typeof metaCreator === 'function') {
      action.meta = metaCreator(action.payload);
    }

    action.meta = Object.assign({}, action.meta, {
      api: true,
      endpoint: finalEndpoint,
      method: method,
      types: [type.concat('_' + method.toUpperCase() + '_REQUEST'), type.concat('_' + method.toUpperCase() + '_SUCCESS'), type.concat('_' + method.toUpperCase() + '_FAILURE')]
    });

    return action;
  };
}