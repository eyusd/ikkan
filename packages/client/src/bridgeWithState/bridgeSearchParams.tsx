import {
  IkkanConfig,
  JsonValue,
  makeFetcherSearchParamsNoEndpoint,
  makeFetcherSearchParamsWithEndpoint,
  NextHTTPMethod,
} from "@ikkan/core";
import { makeTransformNoEndpoint, makeTransformWithEndpoint } from "./utils";
import { z } from "zod";
import { IkkanSideEffects } from "../sideEffect";
import { clientHookNoEndpoint, clientHookWithEndpoint } from "src/utils";

export function bridgeSearchParamsNoEndpoint<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType,
  T extends JsonValue[],
>(
  config: IkkanConfig<Method, Output, Schema, undefined>,
  sideEffects: IkkanSideEffects<T, Output, Schema, undefined>,
) {
  const { endpoint, method } = config;
  const fetcher = makeFetcherSearchParamsNoEndpoint<Method, Output, Schema>(
    endpoint,
    method,
  );
  const transform = makeTransformNoEndpoint<Output, Schema>(endpoint);
  return clientHookNoEndpoint(fetcher, sideEffects, transform);
}

export function bridgeSearchParamsWithEndpoint<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType,
  EndpointArgs extends Record<string, string | string[]>,
  T extends JsonValue[],
>(
  config: IkkanConfig<Method, Output, Schema, EndpointArgs>,
  sideEffects: IkkanSideEffects<T, Output, Schema, EndpointArgs>,
) {
  const { endpoint, method } = config;
  const fetcher = makeFetcherSearchParamsWithEndpoint<
    Method,
    Output,
    Schema,
    EndpointArgs
  >(endpoint, method);
  const transform = makeTransformWithEndpoint<Output, Schema, EndpointArgs>(
    endpoint,
  );
  return clientHookWithEndpoint(fetcher, sideEffects, transform);
}
