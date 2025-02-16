import {
  IkkanConfig,
  JsonValue,
  makeFetcherNoSchemaNoEndpoint,
  makeFetcherNoSchemaWithEndpoint,
  NextHTTPMethod,
} from "@ikkan/core";
import {
  partializeFetcherNoEndpoint,
  partializeFetcherWithEndpoint,
} from "./utils";
import { IkkanServerBridgeHandler } from "./types";

export function ikkanServerBridgeNoSchemaNoEndpoint<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  SSI extends (() => Promise<any>) | undefined,
>(
  config: IkkanConfig<Method, Output, undefined, undefined, SSI>,
) {
  const { endpoint, method } = config;

  const fetcher = makeFetcherNoSchemaNoEndpoint<Method, Output>(
    endpoint,
    method,
  );

  return partializeFetcherNoEndpoint(fetcher) as IkkanServerBridgeHandler<
    Output,
    undefined,
    undefined
  >;
}

export function ikkanServerBridgeNoSchemaWithEndpoint<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Segments extends Record<string, string | string[]>,
  SSI extends (() => Promise<any>) | undefined,
>(
  config: IkkanConfig<
    Method,
    Output,
    undefined,
    Segments,
    SSI
  >,
) {
  const { endpoint, method } = config;

  const fetcher = makeFetcherNoSchemaWithEndpoint<Method, Output, Segments>(
    endpoint,
    method,
  );

  return partializeFetcherWithEndpoint(fetcher) as IkkanServerBridgeHandler<
    Output,
    undefined,
    Segments
  >;
}
