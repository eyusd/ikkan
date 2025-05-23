import {
  schemaEndpointBranch,
  IkkanConfig,
  JsonValue,
  NextHTTPMethod,
} from "@ikkan/core";
import { z } from "zod";
import { IkkanClientBridgeWithStateHook } from "./types";
import {
  bridgeNoSchemaNoEndpoint,
  bridgeNoSchemaWithEndpoint,
} from "./bridgeNoSchema";
import {
  bridgeBodyParamsNoEndpoint,
  bridgeBodyParamsWithEndpoint,
} from "./bridgeBodyParams";
import {
  bridgeSearchParamsNoEndpoint,
  bridgeSearchParamsWithEndpoint,
} from "./bridgeSearchParams";
import { IkkanSideEffects } from "../sideEffect";

export { type IkkanClientBridgeWithStateHook } from "./types";
export function ikkanBridgeWithState<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType | undefined,
  Segments extends Record<string, string | string[]> | undefined,
  SSI extends (() => Promise<any>) | undefined,
  T extends JsonValue[],
>(
  config: IkkanConfig<Method, Output, Schema, Segments, SSI>,
  sideEffects: IkkanSideEffects<T, Output, Schema, Segments>,
): IkkanClientBridgeWithStateHook<Output, Schema, Segments> {
  const handler = schemaEndpointBranch(config, [sideEffects], {
    noSchemaNoEndpoint: bridgeNoSchemaNoEndpoint,
    noSchemaWithEndpoint: bridgeNoSchemaWithEndpoint,
    bodyParamsNoEndpoint: bridgeBodyParamsNoEndpoint,
    bodyParamsWithEndpoint: bridgeBodyParamsWithEndpoint,
    searchParamsNoEndpoint: bridgeSearchParamsNoEndpoint,
    searchParamsWithEndpoint: bridgeSearchParamsWithEndpoint,
  });

  return handler as IkkanClientBridgeWithStateHook<
    Output,
    Schema,
    Segments
  >;
}
