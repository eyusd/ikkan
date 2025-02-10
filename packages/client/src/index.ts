import { IkkanConfig, JsonValue, NextHTTPMethod } from "@ikkan/core";
import { z } from "zod";
import { IkkanClientBridgeHandler } from "./types";
import { ikkanBridgeWithState } from "./bridgeWithState";
import { ikkanBridgeNoState } from "./bridgeNoState";
import { IkkanSideEffects } from "./sideEffect";

export { sideEffect } from "./sideEffect";
export { type IkkanSchema } from "./types";

/**
 * Turns an Ikkan configuration object into a client bridge handler.
 *
 * @template Method - The HTTP method type (e.g., GET, POST).
 * @template Output - The expected JSON output type.
 * @template Schema - The Zod schema type for validation, or undefined if not used.
 * @template EndpointArgs - The type of endpoint arguments, or undefined if not used.
 * @template ServerSideImports - The type of server-side imports, or undefined if not used.
 * @template T - The type of side effect arguments.
 *
 * @param {IkkanConfig<Method, Output, Schema, EndpointArgs, ServerSideImports>} config - The configuration object for the Ikkan client bridge.
 * @param {IkkanSideEffects<T, Output, Schema, EndpointArgs>} [sideEffects=[] as any] - Optional side effects to be applied during the bridge interaction.
 * @returns {IkkanClientBridgeHandler<Method, Output, Schema, EndpointArgs>} An object containing the hook and action for the client bridge.
 */
export function ikkanClientBridge<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType | undefined,
  EndpointArgs extends Record<string, string | string[]> | undefined,
  ServerSideImports extends (() => Promise<any>) | undefined,
  T extends JsonValue[],
>(
  config: IkkanConfig<Method, Output, Schema, EndpointArgs, ServerSideImports>,
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
