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
  SSI extends (() => Promise<any>) | undefined,
  T extends JsonValue[],
>(
  config: IkkanConfig<Method, Output, undefined, undefined, SSI>,
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
  Segments extends Record<string, string | string[]>,
  SSI extends (() => Promise<any>) | undefined,
  T extends JsonValue[],
>(
  config: IkkanConfig<
    Method,
    Output,
    undefined,
    Segments,
    SSI
  >,
  sideEffects: IkkanSideEffects<T, Output, undefined, Segments>,
) {
  const { endpoint, method } = config;
  const fetcher = makeFetcherNoSchemaWithEndpoint<Method, Output, Segments>(
    endpoint,
    method,
  );
  const transform = makeTransformWithEndpoint<Output, undefined, Segments>(
    endpoint,
  );
  return clientHookWithEndpoint(fetcher, sideEffects, transform);
}
