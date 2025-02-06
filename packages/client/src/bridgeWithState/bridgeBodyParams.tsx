import {
  IkkanConfig,
  JsonValue,
  makeFetcherBodyParamsNoEndpoint,
  makeFetcherBodyParamsWithEndpoint,
  NextHTTPMethod,
} from "@ikkan/core";
import { IkkanSideEffects } from "../sideEffect";
import { makeTransformNoEndpoint, makeTransformWithEndpoint } from "./utils";
import { z } from "zod";
import { IkkanClientBridgeWithStateHook } from "./types";
import { clientHookNoEndpoint, clientHookWithEndpoint } from "src/utils";

export function bridgeBodyParamsNoEndpoint<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType,
  T extends JsonValue[],
>(
  config: IkkanConfig<Method, Output, Schema, undefined>,
  sideEffects: IkkanSideEffects<T, Output, Schema, undefined>,
) {
  const { endpoint, method } = config;
  const fetcher = makeFetcherBodyParamsNoEndpoint<Method, Output, Schema>(
    endpoint,
    method,
  );
  const transform = makeTransformNoEndpoint<Output, Schema>(endpoint);
  return clientHookNoEndpoint(
    fetcher,
    sideEffects,
    transform,
  ) as IkkanClientBridgeWithStateHook<Output, Schema, undefined>;
}

export function bridgeBodyParamsWithEndpoint<
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
  const fetcher = makeFetcherBodyParamsWithEndpoint<
    Method,
    Output,
    Schema,
    EndpointArgs
  >(endpoint, method);
  const transform = makeTransformWithEndpoint<Output, Schema, EndpointArgs>(
    endpoint,
  );
  return clientHookWithEndpoint(
    fetcher,
    sideEffects,
    transform,
  ) as IkkanClientBridgeWithStateHook<Output, Schema, EndpointArgs>;
}
