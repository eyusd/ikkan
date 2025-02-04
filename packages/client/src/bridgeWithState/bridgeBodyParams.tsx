import {
  IkkanHandlerParams,
  JsonValue,
  makeFetcherBodyParamsNoEndpoint,
  makeFetcherBodyParamsWithEndpoint,
  NextHTTPMethod,
} from "@ikkan/core";
import { WaterfallFunction } from "../types";
import {
  waterfallNoEndpoint,
  waterfallWithEndpoint,
} from "../utils";
import { makeTransformNoEndpoint, makeTransformWithEndpoint } from "./utils";
import { z } from "zod";
import { IkkanClientBridgeWithStateHook } from "./types";

export function bridgeBodyParamsNoEndpoint<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType,
  EndpointArgs extends undefined,
  Mut extends [string, unknown][],
>(
  params: IkkanHandlerParams<Method, Output, Schema, EndpointArgs>,
  waterfall: {
    [K in keyof Mut]: WaterfallFunction<Mut[K][0], Output, Mut[K][1]>;
  },
) {
  const { endpoint, method } = params;
  const fetcher = makeFetcherBodyParamsNoEndpoint<Method, Output, Schema, EndpointArgs>(
    endpoint,
    method,
  );
  const transform = makeTransformNoEndpoint<Output, Schema, EndpointArgs>(endpoint)
  return waterfallNoEndpoint(fetcher, waterfall, transform) as IkkanClientBridgeWithStateHook<Output, Schema, EndpointArgs>
}

export function bridgeBodyParamsWithEndpoint<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType,
  EndpointArgs extends Record<string, string | string[]>,
  Mut extends [string, unknown][],
>(
  params: IkkanHandlerParams<Method, Output, Schema, EndpointArgs>,
  waterfall: {
    [K in keyof Mut]: WaterfallFunction<Mut[K][0], Output, Mut[K][1]>;
  },
) {
  const { endpoint, method } = params;
  const fetcher = makeFetcherBodyParamsWithEndpoint<Method, Output, Schema, EndpointArgs>(
    endpoint,
    method,
  );
  const transform = makeTransformWithEndpoint<Output, Schema, EndpointArgs>(endpoint)
  return waterfallWithEndpoint(fetcher, waterfall, transform) as IkkanClientBridgeWithStateHook<Output, Schema, EndpointArgs>
}
