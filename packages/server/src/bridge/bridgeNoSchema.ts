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
>(config: IkkanConfig<Method, Output, undefined, undefined>) {
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
  EndpointArgs extends Record<string, string | string[]>,
>(config: IkkanConfig<Method, Output, undefined, EndpointArgs>) {
  const { endpoint, method } = config;

  const fetcher = makeFetcherNoSchemaWithEndpoint<Method, Output, EndpointArgs>(
    endpoint,
    method,
  );

  return partializeFetcherWithEndpoint(fetcher) as IkkanServerBridgeHandler<
    Output,
    undefined,
    EndpointArgs
  >;
}
