import {
  branchHandler,
  IkkanConfig,
  JsonValue,
  NextHTTPMethod,
} from "@ikkan/core";
import { z } from "zod";
import { IkkanClientBridgeNoStateHook } from "./types";
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

export { type IkkanClientBridgeNoStateHook } from "./types";
export function ikkanBridgeNoState<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType | undefined,
  EndpointArgs extends Record<string, string | string[]> | undefined,
  T extends JsonValue[],
>(
  config: IkkanConfig<Method, Output, Schema, EndpointArgs>,
  sideEffects: IkkanSideEffects<T, Output, Schema, EndpointArgs>,
): IkkanClientBridgeNoStateHook<Method, Output, Schema, EndpointArgs> {
  const handler = branchHandler(config, [sideEffects], {
    noSchemaNoEndpoint: bridgeNoSchemaNoEndpoint,
    noSchemaWithEndpoint: bridgeNoSchemaWithEndpoint,
    bodyParamsNoEndpoint: bridgeBodyParamsNoEndpoint,
    bodyParamsWithEndpoint: bridgeBodyParamsWithEndpoint,
    searchParamsNoEndpoint: bridgeSearchParamsNoEndpoint,
    searchParamsWithEndpoint: bridgeSearchParamsWithEndpoint,
  });

  return handler as IkkanClientBridgeNoStateHook<
    Method,
    Output,
    Schema,
    EndpointArgs
  >;
}
