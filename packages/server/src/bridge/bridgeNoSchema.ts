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
  ServerSideImports extends (() => Promise<any>) | undefined,
>(
  config: IkkanConfig<Method, Output, undefined, undefined, ServerSideImports>,
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
  EndpointArgs extends Record<string, string | string[]>,
  ServerSideImports extends (() => Promise<any>) | undefined,
>(
  config: IkkanConfig<
    Method,
    Output,
    undefined,
    EndpointArgs,
    ServerSideImports
  >,
) {
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
