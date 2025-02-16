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
  SSI extends (() => Promise<any>) | undefined,
  T extends JsonValue[],
>(
  config: IkkanConfig<Method, Output, Schema, undefined, SSI>,
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
  Segments extends Record<string, string | string[]>,
  SSI extends (() => Promise<any>) | undefined,
  T extends JsonValue[],
>(
  config: IkkanConfig<Method, Output, Schema, Segments, SSI>,
  sideEffects: IkkanSideEffects<T, Output, Schema, Segments>,
) {
  const { endpoint, method } = config;
  const fetcher = makeFetcherSearchParamsWithEndpoint<
    Method,
    Output,
    Schema,
    Segments
  >(endpoint, method);
  const transform = makeTransformWithEndpoint<Output, Schema, Segments>(
    endpoint,
  );
  return clientHookWithEndpoint(fetcher, sideEffects, transform);
}
