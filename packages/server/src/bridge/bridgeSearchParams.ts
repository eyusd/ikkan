import {
  IkkanConfig,
  JsonValue,
  makeFetcherSearchParamsNoEndpoint,
  makeFetcherSearchParamsWithEndpoint,
  NextHTTPMethod,
} from "@ikkan/core";
import {
  partializeFetcherNoEndpoint,
  partializeFetcherWithEndpoint,
} from "./utils";
import { z } from "zod";
import { IkkanServerBridgeHandler } from "./types";

export function ikkanServerBridgeSearchParamsNoEndpoint<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType,
>(config: IkkanConfig<Method, Output, Schema, undefined>) {
  const { endpoint, method } = config;

  const fetcher = makeFetcherSearchParamsNoEndpoint<Method, Output, Schema>(
    endpoint,
    method,
  );

  return partializeFetcherNoEndpoint(fetcher) as IkkanServerBridgeHandler<
    Output,
    Schema,
    undefined
  >;
}

export function ikkanServerBridgeSearchParamsWithEndpoint<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType,
  EndpointArgs extends Record<string, string | string[]>,
>(config: IkkanConfig<Method, Output, Schema, EndpointArgs>) {
  const { endpoint, method } = config;

  const fetcher = makeFetcherSearchParamsWithEndpoint<
    Method,
    Output,
    Schema,
    EndpointArgs
  >(endpoint, method);

  return partializeFetcherWithEndpoint(fetcher) as IkkanServerBridgeHandler<
    Output,
    Schema,
    EndpointArgs
  >;
}
