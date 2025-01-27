import {
  IkkanHandlerParams,
  JsonValue,
  methodHandler,
  NextHTTPMethod,
} from "@ikkan/core";
import { z } from "zod";
import { ikkanServerBridgeBodyParams } from "./bridgeBodyParams";
import { ikkanServerBridgeSearchParams } from "./bridgeSearchParams";
import { IkkanServerBridgeHandler } from "./types";

/**
 * Creates an Ikkan server bridge handler for the specified endpoint, method, and output type.
 *
 * @template Endpoint - The type of the endpoint string.
 * @template Method - The HTTP method type (e.g., GET, POST).
 * @template Output - The type of the output JSON value.
 * @template Schema - The optional Zod schema type for validation.
 *
 * @param {IkkanHandlerParams<Method, Output, Schema>} params - The parameters for the Ikkan handler, including the HTTP method, output type, and optional schema.
 * @returns {IkkanServerBridgeHandler<Endpoint, Output, Schema>} - The Ikkan server bridge handler for the specified endpoint, method, and output type.
 */
export function ikkanServerBridge<
  Endpoint extends string,
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType | undefined = undefined,
>(
  params: IkkanHandlerParams<Method, Output, Schema>,
): IkkanServerBridgeHandler<Endpoint, Output, Schema> {
  const { method } = params;

  return methodHandler(method, {
    body: ikkanServerBridgeBodyParams(params),
    search: ikkanServerBridgeSearchParams(params),
  });
}
