redux-actions-api-addon
=============

API Addon for [Flux Standard Action](https://github.com/acdlite/flux-standard-action) utilities for Redux.

```js
npm install --save redux-actions-api-addon
```
```js
import { createAPIAction } from 'redux-actions-api-addon';
```

### The Problem?

When creating redux actions for API Requests, in reality there are 3 actions that are spawned

1. Request Event
2. Success Event
3. Failure Event

This can lead to a _lot_ of boilerplate.

Now, there are some packages out there to handle this ex: [https://github.com/agraboso/redux-api-middleware](https://github.com/agraboso/redux-api-middleware) However, these packages aren't FSA Compliant [https://github.com/acdlite/flux-standard-action](https://github.com/acdlite/flux-standard-action)

This add on attemps to solve 2 things:

1. Reduce boilerplate by auto dispatching Request, Success, and Failure Events
2. Be FSA Compliant

In order to be FSA Compliant, most of the information is stored in the `meta` object.


# The Simple Way (`{string} endpoint`)

### `createAPIAction(type, method, endpoint, payloadCreator = Identity, ?metaCreator)`

Wraps an action creator so that its return value is the payload of a Flux Standard Action, and also creates multiple actions types that can be handled via middleware (Request, Success, and Failure Types).

The parameters you pass to your action are **verb dependant**

Also adds `meta` data, such as the `method` and `endpoint` to be used where you see fit.

If no payload creator is passed, or if it's not a function, the identity function is used.


Example:

```js
let createContact = createAPIAction('CREATE_CONTACT', 'POST', '/contacts' );

expect(createContact( {name: "James Kusachi"} )).to.deep.equal({
  "type": "CREATE_CONTACT",
  "payload": {name": "James Kusachi"},
  "meta": {
  	"api": true,
  	"method": "POST",
  	"endpoint": "/contacts",
  	"types": [
  		"CREATE_CONTACT_REQUEST",
  		"CREATE_CONTACT_SUCCESS",
  		"CREATE_CONTACT_FAILURE",
  	]
  }
});
```

If the payload is an instance of an [Error
object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Error),
redux-actions will automatically set ```action.error``` to true.

The following are **Verb Based Examples** so you can see how to use your actions

### GET
```js
let getItems = createAPIAction('ITEMS', 'GET', '/items' );
getItems()

```
there is no need to pass a payload to your action, as its a `GET` request

*Auto Generated Action Types*
- `ITEMS_GET_REQUEST`
- `ITEMS_GET_SUCCESS`
- `ITEMS_GET_FAILURE`

**Sample**

```json
{
  "type": "ITEMS",
  "payload": {},
  "meta": {
    "api": true,
    "method": "GET",
    "endpoint": "/items",
    "types": [
      "ITEMS_GET_REQUEST",
      "ITEMS_GET_SUCCESS",
      "ITEMS_GET_FAILURE"
    ]
  }
}
```


### POST

```js
let createItem = createAPIAction('ITEMS', 'POST', '/items' );
createItem({name: "James Kusachi"});
```
In a case where you `POST` new data, you dont need to specify an id, but you do need to pass data.
Any data passed as the first parameter will be treated as the payload to be sent across.

*Auto Generated Action Types*
- `ITEMS_POST_REQUEST`
- `ITEMS_POST_SUCCESS`
- `ITEMS_POST_FAILURE`

**Sample**

```json
{
  "type": "ITEMS",
  "payload": {
    "name": "James Kusachi"
  },
  "meta": {
    "api": true,
    "method": "POST",
    "endpoint": "/items",
    "types": [
      "ITEMS_POST_REQUEST",
      "ITEMS_POST_SUCCESS",
      "ITEMS_POST_FAILURE"
    ]
  }
}
```


### PUT

```js
let updateItem = createAPIAction('ITEMS', 'PUT', '/items' );
updateItem(15, {name: "Ronald McDonald"});

```
In the event of an `UPDATE`, you generally need to specify 2 pieces
* id of item you are updating
* the data you want to update with

In this case, we are updating primary item `15` with a new object

*Auto Generated Action Types*
- `ITEMS_PUT_REQUEST`
- `ITEMS_PUT_SUCCESS`
- `ITEMS_PUT_FAILURE`

**Sample**

```json
{
  "type": "ITEMS",
  "payload": {
    "name": "james"
  },
  "meta": {
    "api": true,
    "method": "PUT",
    "endpoint": "/items/10",
    "types": [
      "ITEMS_PUT_REQUEST",
      "ITEMS_PUT_SUCCESS",
      "ITEMS_PUT_FAILURE"
    ]
  }
}
```

### DELETE
```js
let deleteItem = createAPIAction('ITEMS', 'DELETE', '/items' );
deleteItem(15);

```
In the case of `DELETE`, you just need to specify the primary id of tha which you want to delete.
No need to pass in any payload data, as that would get dropped anyways because of `DELETE`

*Auto Generated Action Types*
- `ITEMS_DELETE_REQUEST`
- `ITEMS_DELETE_SUCCESS`
- `ITEMS_DELETE_FAILURE`

**Sample**

```json
{
  "type": "ITEMS",
  "payload": {},
  "meta": {
    "api": true,
    "method": "DELETE",
    "endpoint": "/items/5",
    "types": [
      "ITEMS_DELETE_REQUEST",
      "ITEMS_DELETE_SUCCESS",
      "ITEMS_DELETE_FAILURE"
    ]
  }
}
```


# Advanced (`{function} endpoint`)

In cases where you need to customize the endpoint with more granularity, you can pass a `function` as the `endpoint` instead of a string. This gives you access to the payload so you can create dynamic endpoints based on the payload.

NOTE: When using the Advanced method, you only need to send a payload across.  In the Simple version, parameter order is important (IE: for PUTs, first parameter is ID, second is payload, for POST the parameter is the payload).

For the advanced version, you only need to send the payload, and your endpoint will return dynamically based on your function.

examples:

**GET Example**

```js
const customEndpoint = (p) => {
  return `/tester/${p}/mctesterson`;
};

const getItems = createAPIAction(type, 'GET', customEndpoint);

getItems(10); //GET /tester/10/mctesterson

```

**POST Example**

```js
const customEndpoint = (params) => {
  return `/user/${params.id}/ronald/${params.name}`;
};
const createItem = createAPIAction(type, 'POST', customEndpoint);
const payload = { id: 10, name: 'james' };

createItem(payload); //POST /user/10/ronald/james
```

**PUT Example**

```js
const customEndpoint = (params) => {
  return `/user/${params.id}`;
};
const updateItem = createAPIAction(type, 'PUT', customEndpoint);
const payload = { id: 10, name: 'james' };

updateItem(payload); //PUT /user/10
```

**DELETE Example**

```js
const customEndpoint = ({id, accountID}) => {
  return `/user/${id}/account/${accountID}`;
};
const deleteItem = createAPIAction(type, 'DELETE', customEndpoint);
const payload = { id: 10, accountID: 25 };

deleteItem(payload); //DELETE /user/10/account/25
```


