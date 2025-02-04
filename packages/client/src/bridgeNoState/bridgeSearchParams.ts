import {
  IkkanHandlerParams,
  JsonValue,
  makeFetcherSearchParamsNoEndpoint,
  makeFetcherSearchParamsWithEndpoint,
  NextHTTPMethod,
} from "@ikkan/core";
import { WaterfallFunction } from "../types";
import { waterfallNoEndpoint, waterfallWithEndpoint } from "../utils";
import { z } from "zod";
import { makeTransform } from "./utils";
import { IkkanClientBridgeNoStateHook } from "./types";

export function bridgeSearchParamsNoEndpoint<
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
  const fetcher = makeFetcherSearchParamsNoEndpoint<Method, Output, Schema, EndpointArgs>(
    endpoint,
    method,
  );
  const transform = makeTransform<Method, Output, Schema>(method)

  return waterfallNoEndpoint(fetcher, waterfall, transform) as IkkanClientBridgeNoStateHook<Method, Output, Schema, EndpointArgs>
}


export function bridgeSearchParamsWithEndpoint<
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
  const fetcher = makeFetcherSearchParamsWithEndpoint<Method, Output, Schema, EndpointArgs>(
    endpoint,
    method,
  );
  const transform = makeTransform<Method, Output, Schema>(method)

  return waterfallWithEndpoint(fetcher, waterfall, transform) as IkkanClientBridgeNoStateHook<Method, Output, Schema, EndpointArgs>
}