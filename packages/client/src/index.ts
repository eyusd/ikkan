import {
  IkkanConfig,
  JsonValue,
  NextHTTPMethod,
} from "@ikkan/core";
import { z } from "zod";
import { IkkanClientBridgeHandler } from "./types";
import { ikkanBridgeWithState } from "./bridgeWithState";
import { ikkanBridgeNoState } from "./bridgeNoState";
import { IkkanSideEffects } from "./sideEffect";

export { sideEffect } from "./sideEffect";
export { type IkkanSchema } from "./types";

export function ikkanClientBridge<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType | undefined,
  EndpointArgs extends Record<string, string | string[]> | undefined,
  T extends JsonValue[],
>(
  config: IkkanConfig<Method, Output, Schema, EndpointArgs>,
  sideEffects: IkkanSideEffects<T, Output, Schema, EndpointArgs> = [] as any,
): IkkanClientBridgeHandler<Method, Output, Schema, EndpointArgs> {
  const hook = ikkanBridgeWithState(config, sideEffects);
  const action = ikkanBridgeNoState(config, sideEffects);
  return { hook, action } as IkkanClientBridgeHandler<
    Method,
    Output,
    Schema,
    EndpointArgs
  >;
}
