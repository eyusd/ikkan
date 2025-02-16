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
 * @template Segments - The type of endpoint arguments, or undefined if not used.
 * @template SSI - The type of server-side imports, or undefined if not used.
 * @template T - The type of side effect arguments.
 *
 * @param {IkkanConfig<Method, Output, Schema, Segments, SSI>} config - The configuration object for the Ikkan client bridge.
 * @param {IkkanSideEffects<T, Output, Schema, Segments>} [sideEffects=[] as any] - Optional side effects to be applied during the bridge interaction.
 * @returns {IkkanClientBridgeHandler<Method, Output, Schema, Segments>} An object containing the hook and action for the client bridge.
 */
export function ikkanClientBridge<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType | undefined,
  Segments extends Record<string, string | string[]> | undefined,
  SSI extends (() => Promise<any>) | undefined,
  T extends JsonValue[],
>(
  config: IkkanConfig<Method, Output, Schema, Segments, SSI>,
  sideEffects: IkkanSideEffects<T, Output, Schema, Segments> = [] as any,
): IkkanClientBridgeHandler<Method, Output, Schema, Segments> {
  const hook = ikkanBridgeWithState(config, sideEffects);
  const action = ikkanBridgeNoState(config, sideEffects);
  return { hook, action } as IkkanClientBridgeHandler<
    Method,
    Output,
    Schema,
    Segments
  >;
}
