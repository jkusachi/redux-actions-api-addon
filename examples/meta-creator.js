import { createAPIAction } from 'redux-actions-api-addon';

const type = 'CONTACT';
const actionCreator = createAPIAction(
  type,
  'GET',
  () => '/contacts',
  null,
  () => ({
    extra: 'value',
    another: 'value',
  })
);

const action = actionCreator();
//
// {
//   "type": "CONTACT",
//   "payload": {},
//   "meta": {
//     "extra": "value",
//     "another": "value",
//     "api": true,
//     "endpoint": "/contacts",
//     "method": "GET",
//     "types": ["CONTACT_GET_REQUEST", "CONTACT_GET_SUCCESS", "CONTACT_GET_FAILURE"]
//   }
// }
