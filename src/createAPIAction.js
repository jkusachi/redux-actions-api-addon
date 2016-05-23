const objectAssign = require('object-assign');

/**
 * Returns the endpoint based on HTTP Verb
 * Contains a specific case for GET BY ID because
 * the verb is the same as a GET ALL
**/
function getEndpoint(method, endpoint, params) {

  const [firstParam, ...others] = params;

  if (typeof endpoint === 'function') {
    return endpoint(firstParam);
  }

  switch (method) {
    case 'DELETE':
    case 'PUT':
      return `${endpoint}/${firstParam}`;
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

  const [firstParam, ...others] = params;

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

export default function createAPIAction(type, method, endpoint, actionCreator, metaCreator) {
  return (...params) => {

    const [firstParam, ...others] = params;

    const finalEndpoint = getEndpoint(method, endpoint, params);

    const action = {
      type,
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

    action.meta = objectAssign({}, action.meta, {
      api: true,
      endpoint: finalEndpoint,
      method,
      types: [
        type.concat(`_${method.toUpperCase()}_REQUEST`),
        type.concat(`_${method.toUpperCase()}_SUCCESS`),
        type.concat(`_${method.toUpperCase()}_FAILURE`)
      ]
    });

    return action;
  };
}
