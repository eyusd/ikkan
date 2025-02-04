import {
  IkkanHandlerParams,
  JsonValue,
  makeFetcherSearchParamsNoEndpoint,
  makeFetcherSearchParamsWithEndpoint,
  NextHTTPMethod,
} from "@ikkan/core";
import { partializeFetcherNoEndpoint, partializeFetcherWithEndpoint } from "./utils";
import { z } from "zod";
import { IkkanServerBridgeHandler } from "./types";

export function ikkanServerBridgeSearchParamsNoEndpoint<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType,
  EndpointArgs extends undefined,
>(params: IkkanHandlerParams<Method, Output, Schema, EndpointArgs>) {
  const { endpoint, method } = params;

  const fetcher = makeFetcherSearchParamsNoEndpoint<
    Method,
    Output,
    Schema,
    EndpointArgs
  >(endpoint, method);

  return partializeFetcherNoEndpoint(fetcher) as IkkanServerBridgeHandler<Output, Schema, EndpointArgs>;
}

export function ikkanServerBridgeSearchParamsWithEndpoint<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType,
  EndpointArgs extends Record<string, string | string[]>,
>(params: IkkanHandlerParams<Method, Output, Schema, EndpointArgs>) {
  const { endpoint, method } = params;

  const fetcher = makeFetcherSearchParamsWithEndpoint<
    Method,
    Output,
    Schema,
    EndpointArgs
  >(endpoint, method);

  return partializeFetcherWithEndpoint(fetcher) as IkkanServerBridgeHandler<Output, Schema, EndpointArgs>;
}
