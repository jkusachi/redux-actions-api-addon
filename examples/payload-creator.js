import { createAPIAction } from 'redux-actions-api-addon';

const type = 'CONTACT';
const actionCreator = createAPIAction(
  type,
  'GET',
  () => '/contacts',
  (arg1, arg2) => ({
      name: 'Ronald McDonald',
      details: arg1,
      deep: {
          key: arg2,
      }
  })
);

const action = actionCreator();
// {
//   "type": "CONTACT",
//   "payload": {
//     "name": "Ronald McDonald",
//     "deep": {}
//   },
//   "meta": {
//     "api": true,
//     "endpoint": "/contacts",
//     "method": "GET",
//     "types": ["CONTACT_GET_REQUEST", "CONTACT_GET_SUCCESS", "CONTACT_GET_FAILURE"]
//   }
// }
