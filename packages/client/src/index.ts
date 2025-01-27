import {
  IkkanHandlerParams,
  JsonValue,
  methodHandler,
  NextHTTPMethod,
} from "@ikkan/core";
import { z } from "zod";
import { WaterfallFunction } from "./types";
import {
  ikkanClientBridgeBodyParamsWithState,
  ikkanClientBridgeSearchParamsWithState,
  IkkanClientBridgeWithStateHook,
} from "./bridgeWithState";
import {
  ikkanClientBridgeBodyParamsNoState,
  IkkanClientBridgeNoStateHook,
  ikkanClientBridgeSearchParamsNoState,
} from "./bridgeNoState";

type IkkanClientBridgeHook<
  Endpoint extends string,
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType | undefined = undefined,
> =
  | IkkanClientBridgeWithStateHook<Endpoint, Output, Schema>
  | IkkanClientBridgeNoStateHook<Endpoint, Method, Output, Schema>;

/**
 * Creates a client bridge for handling HTTP requests with optional state and waterfall functions.
 *
 * @template Endpoint - The endpoint string.
 * @template Method - The HTTP method type.
 * @template Output - The expected output type.
 * @template Schema - The optional Zod schema type for validation.
 * @template Mut - The mutation array type.
 *
 * @param {IkkanHandlerParams<Method, Output, Schema>} params - The handler parameters including method, body, and search params.
 * @param {boolean} state - A boolean indicating whether to include state in the request.
 * @param {Object} waterfall - An object containing waterfall functions for mutating the request.
 * @returns {IkkanClientBridgeHook<Endpoint, Method, Output, Schema>} - The client bridge hook for the specified endpoint and method.
 */
export function ikkanClientBridge<
  Endpoint extends string,
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType | undefined = undefined,
  Mut extends [string, unknown][] = [],
>(
  params: IkkanHandlerParams<Method, Output, Schema>,
  state: boolean,
  waterfall: {
    [K in keyof Mut]: WaterfallFunction<Mut[K][0], Output, Mut[K][1]>;
  },
): IkkanClientBridgeHook<Endpoint, Method, Output, Schema> {
  const { method } = params;

  if (state) {
    return methodHandler(method, {
      body: ikkanClientBridgeBodyParamsWithState(params, waterfall),
      search: ikkanClientBridgeSearchParamsWithState(params, waterfall),
    });
  } else {
    return methodHandler(method, {
      body: ikkanClientBridgeBodyParamsNoState(params, waterfall),
      search: ikkanClientBridgeSearchParamsNoState(params, waterfall),
    });
  }
}
