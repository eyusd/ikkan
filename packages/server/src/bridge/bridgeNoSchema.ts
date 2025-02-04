import {
  IkkanHandlerParams,
  JsonValue,
  makeFetcherNoSchemaNoEndpoint,
  makeFetcherNoSchemaWithEndpoint,
  NextHTTPMethod,
} from "@ikkan/core";
import { partializeFetcherNoEndpoint, partializeFetcherWithEndpoint } from "./utils";
import { IkkanServerBridgeHandler } from "./types";

export function ikkanServerBridgeNoSchemaNoEndpoint<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends undefined,
  EndpointArgs extends undefined,
>(params: IkkanHandlerParams<Method, Output, Schema, EndpointArgs>) {
  const { endpoint, method } = params;

  const fetcher = makeFetcherNoSchemaNoEndpoint<Method, Output, Schema, EndpointArgs>(
    endpoint,
    method,
  )

  return partializeFetcherNoEndpoint(fetcher) as IkkanServerBridgeHandler<Output, Schema, EndpointArgs>;
}

export function ikkanServerBridgeNoSchemaWithEndpoint<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends undefined,
  EndpointArgs extends Record<string, string | string[]>,
>(params: IkkanHandlerParams<Method, Output, Schema, EndpointArgs>) {
  const { endpoint, method } = params;

  const fetcher = makeFetcherNoSchemaWithEndpoint<Method, Output, Schema, EndpointArgs>(
    endpoint,
    method,
  );

  return partializeFetcherWithEndpoint(fetcher) as IkkanServerBridgeHandler<Output, Schema, EndpointArgs>;
}
