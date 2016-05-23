
/**
 * Returns the endpoint based on HTTP Verb
 * Contains a specific case for GET BY ID because
 * the verb is the same as a GET ALL
**/
function getEndpoint(method, endpoint, itemID) {

  if (method === 'GET' && typeof itemID === 'number') {
    return `${endpoint}/${itemID}`;
  }

  switch (method) {
    case 'DELETE':
    case 'PUT':
      return `${endpoint}/${itemID}`;
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
function getPayload(method, itemIDorPayload, data) {
  if (itemIDorPayload instanceof Error) {
    return itemIDorPayload;
  }

  switch (method) {
    case 'POST':
      return itemIDorPayload;
    case 'PUT':
      return data;
    default:
      return {};
  }
}

export default function createAPIAction(type, method, endpoint, actionCreator, metaCreator) {
  return (param1, ...params) => {

    const finalEndpoint = getEndpoint(method, endpoint, param1);

    const action = {
      type,
      payload: getPayload(method, param1, ...params)
    };

    if (action.payload instanceof Error) {
      // Handle FSA errors where the payload is an Error object. Set error.
      action.error = true;
      action.payload = param1;
    }

    if (typeof metaCreator === 'function') {
      action.meta = metaCreator(action.payload);

    }

    action.meta = Object.assign({}, action.meta, {
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
