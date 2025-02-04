import {
  IkkanHandlerParams,
  JsonValue,
  makeFetcherBodyParamsNoEndpoint,
  makeFetcherBodyParamsWithEndpoint,
  NextHTTPMethod,
} from "@ikkan/core";
import { partializeFetcherNoEndpoint, partializeFetcherWithEndpoint } from "./utils";
import { z } from "zod";
import { IkkanServerBridgeHandler } from "./types";

export function ikkanServerBridgeBodyParamsNoEndpoint<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType,
  EndpointArgs extends undefined,
>(params: IkkanHandlerParams<Method, Output, Schema, EndpointArgs>) {
  const { endpoint, method } = params;

  const fetcher = makeFetcherBodyParamsNoEndpoint<Method, Output, Schema, EndpointArgs>(
    endpoint,
    method,
  );

  return partializeFetcherNoEndpoint(fetcher) as IkkanServerBridgeHandler<Output, Schema, EndpointArgs>;
}

export function ikkanServerBridgeBodyParamsWithEndpoint<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType,
  EndpointArgs extends Record<string, string | string[]>,
>(params: IkkanHandlerParams<Method, Output, Schema, EndpointArgs>) {
  const { endpoint, method } = params;

  const fetcher = makeFetcherBodyParamsWithEndpoint<
    Method,
    Output,
    Schema,
    EndpointArgs
  >(endpoint, method);

  return partializeFetcherWithEndpoint(fetcher) as IkkanServerBridgeHandler<Output, Schema, EndpointArgs>;
}
