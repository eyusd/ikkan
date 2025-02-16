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
  SSI extends (() => Promise<any>) | undefined,
>(config: IkkanConfig<Method, Output, Schema, undefined, SSI>) {
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
  Segments extends Record<string, string | string[]>,
  SSI extends (() => Promise<any>) | undefined,
>(
  config: IkkanConfig<Method, Output, Schema, Segments, SSI>,
) {
  const { endpoint, method } = config;

  const fetcher = makeFetcherSearchParamsWithEndpoint<
    Method,
    Output,
    Schema,
    Segments
  >(endpoint, method);

  return partializeFetcherWithEndpoint(fetcher) as IkkanServerBridgeHandler<
    Output,
    Schema,
    Segments
  >;
}
