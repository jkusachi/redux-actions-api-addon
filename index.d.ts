export as namespace ReduxActionsAPIAddon;

type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

type returnType = string | number | object;

type ForwardFunctionToString = (...args: returnType[]) => string;
type ForwardFunctionToDynamic = (...args: returnType[]) => returnType;

type ActionFunction<P1> = (...P1) => returnType;

export function createAPIAction<
  ActionArg,
  MethodArg,
  EndpointArg,
  PayloadArg,
  MetaArg
>(
  actionType: string,
  method: Method,
  endpoint: string | ForwardFunctionToString,
  payload?: ForwardFunctionToDynamic,
  meta?: ForwardFunctionToDynamic
): ActionFunction<any>;
