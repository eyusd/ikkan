import {
  IkkanHandlerParams,
  JsonValue,
  makeFetcherNoSchemaNoEndpoint,
  makeFetcherNoSchemaWithEndpoint,
  NextHTTPMethod,
} from "@ikkan/core";
import { WaterfallFunction } from "../types";
import { waterfallNoEndpoint, waterfallWithEndpoint } from "../utils";
import { makeTransform } from "./utils";
import { IkkanClientBridgeNoStateHook } from "./types";

export function bridgeNoSchemaNoEndpoint<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends undefined,
  EndpointArgs extends undefined,
  Mut extends [string, unknown][],
>(
  params: IkkanHandlerParams<Method, Output, Schema, EndpointArgs>,
  waterfall: {
    [K in keyof Mut]: WaterfallFunction<Mut[K][0], Output, Mut[K][1]>;
  },
) {
  const { endpoint, method } = params;
  const fetcher = makeFetcherNoSchemaNoEndpoint<Method, Output, Schema, EndpointArgs>(
    endpoint,
    method,
  );
  const transform = makeTransform<Method, Output, Schema>(method)

  return waterfallNoEndpoint(fetcher, waterfall, transform) as IkkanClientBridgeNoStateHook<Method, Output, Schema, EndpointArgs>
}


export function bridgeNoSchemaWithEndpoint<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends undefined,
  EndpointArgs extends Record<string, string | string[]>,
  Mut extends [string, unknown][],
>(
  params: IkkanHandlerParams<Method, Output, Schema, EndpointArgs>,
  waterfall: {
    [K in keyof Mut]: WaterfallFunction<Mut[K][0], Output, Mut[K][1]>;
  },
) {
  const { endpoint, method } = params;
  const fetcher = makeFetcherNoSchemaWithEndpoint<Method, Output, Schema, EndpointArgs>(
    endpoint,
    method,
  );
  const transform = makeTransform<Method, Output, Schema>(method)

  return waterfallWithEndpoint(fetcher, waterfall, transform) as IkkanClientBridgeNoStateHook<Method, Output, Schema, EndpointArgs>
}