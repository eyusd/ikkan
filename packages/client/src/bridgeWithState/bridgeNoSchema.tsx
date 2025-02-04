import {
  IkkanHandlerParams,
  JsonValue,
  makeFetcherNoSchemaNoEndpoint,
  makeFetcherNoSchemaWithEndpoint,
  NextHTTPMethod,
} from "@ikkan/core";
import { WaterfallFunction } from "../types";
import {
  waterfallNoEndpoint,
  waterfallWithEndpoint,
} from "../utils";
import { makeTransformNoEndpoint, makeTransformWithEndpoint } from "./utils";

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
  const transform = makeTransformNoEndpoint<Output, Schema, EndpointArgs>(endpoint);
  return waterfallNoEndpoint(fetcher, waterfall, transform);
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
  const transform = makeTransformWithEndpoint<Output, Schema, EndpointArgs>(endpoint);
  return waterfallWithEndpoint(fetcher, waterfall, transform);
}
