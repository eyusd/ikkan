import {
  IkkanConfig,
  JsonValue,
  makeFetcherBodyParamsNoEndpoint,
  makeFetcherBodyParamsWithEndpoint,
  NextHTTPMethod,
} from "@ikkan/core";
import {
  partializeFetcherNoEndpoint,
  partializeFetcherWithEndpoint,
} from "./utils";
import { z } from "zod";
import { IkkanServerBridgeHandler } from "./types";

export function ikkanServerBridgeBodyParamsNoEndpoint<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType,
  SSI extends (() => Promise<any>) | undefined,
>(config: IkkanConfig<Method, Output, Schema, undefined, SSI>) {
  const { endpoint, method } = config;

  const fetcher = makeFetcherBodyParamsNoEndpoint<Method, Output, Schema>(
    endpoint,
    method,
  );

  return partializeFetcherNoEndpoint(fetcher) as IkkanServerBridgeHandler<
    Output,
    Schema,
    undefined
  >;
}

export function ikkanServerBridgeBodyParamsWithEndpoint<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType,
  Segments extends Record<string, string | string[]>,
  SSI extends (() => Promise<any>) | undefined,
>(
  config: IkkanConfig<Method, Output, Schema, Segments, SSI>,
) {
  const { endpoint, method } = config;

  const fetcher = makeFetcherBodyParamsWithEndpoint<
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
