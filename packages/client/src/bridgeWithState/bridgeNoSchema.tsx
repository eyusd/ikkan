import {
  IkkanConfig,
  JsonValue,
  makeFetcherNoSchemaNoEndpoint,
  makeFetcherNoSchemaWithEndpoint,
  NextHTTPMethod,
} from "@ikkan/core";
import { makeTransformNoEndpoint, makeTransformWithEndpoint } from "./utils";
import { IkkanSideEffects } from "../sideEffect";
import { clientHookNoEndpoint, clientHookWithEndpoint } from "src/utils";

export function bridgeNoSchemaNoEndpoint<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  T extends JsonValue[],
>(
  config: IkkanConfig<Method, Output, undefined, undefined>,
  sideEffects: IkkanSideEffects<T, Output, undefined, undefined>,
) {
  const { endpoint, method } = config;
  const fetcher = makeFetcherNoSchemaNoEndpoint<Method, Output>(
    endpoint,
    method,
  );
  const transform = makeTransformNoEndpoint<Output, undefined>(endpoint);
  return clientHookNoEndpoint(fetcher, sideEffects, transform);
}

export function bridgeNoSchemaWithEndpoint<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  EndpointArgs extends Record<string, string | string[]>,
  T extends JsonValue[],
>(
  config: IkkanConfig<Method, Output, undefined, EndpointArgs>,
  sideEffects: IkkanSideEffects<T, Output, undefined, EndpointArgs>,
) {
  const { endpoint, method } = config;
  const fetcher = makeFetcherNoSchemaWithEndpoint<Method, Output, EndpointArgs>(
    endpoint,
    method,
  );
  const transform = makeTransformWithEndpoint<Output, undefined, EndpointArgs>(
    endpoint,
  );
  return clientHookWithEndpoint(fetcher, sideEffects, transform);
}
