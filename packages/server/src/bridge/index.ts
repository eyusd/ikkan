import {
  schemaEndpointBranch,
  IkkanConfig,
  JsonValue,
  NextHTTPMethod,
} from "@ikkan/core";
import { z } from "zod";
import { IkkanServerBridgeHandler } from "./types";
import {
  ikkanServerBridgeNoSchemaNoEndpoint,
  ikkanServerBridgeNoSchemaWithEndpoint,
} from "./bridgeNoSchema";
import {
  ikkanServerBridgeBodyParamsNoEndpoint,
  ikkanServerBridgeBodyParamsWithEndpoint,
} from "./bridgeBodyParams";
import {
  ikkanServerBridgeSearchParamsNoEndpoint,
  ikkanServerBridgeSearchParamsWithEndpoint,
} from "./bridgeSearchParams";

export { type IkkanSchema } from "./types";

/**
 * Turns an Ikkan configuration object into a server bridge handler.
 *
 * @template Method - The HTTP method type (e.g., GET, POST).
 * @template Output - The type of the output JSON value.
 * @template Schema - The Zod schema type for validation, or undefined if no schema is used.
 * @template Segments - The type of endpoint arguments, or undefined if no arguments are used.
 * @template SSI - The type of server-side imports, or undefined if no imports are used.
 *
 * @param {IkkanConfig<Method, Output, Schema, Segments, SSI>} config - The configuration object for the server bridge.
 * @returns {IkkanServerBridgeHandler<Output, Schema, Segments>} The server bridge handler.
 */
export function ikkanServerBridge<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType | undefined,
  Segments extends Record<string, string | string[]> | undefined,
  SSI extends (() => Promise<any>) | undefined,
>(
  config: IkkanConfig<Method, Output, Schema, Segments, SSI>,
): IkkanServerBridgeHandler<Output, Schema, Segments> {
  const handler = schemaEndpointBranch(config, [], {
    noSchemaNoEndpoint: ikkanServerBridgeNoSchemaNoEndpoint,
    noSchemaWithEndpoint: ikkanServerBridgeNoSchemaWithEndpoint,
    bodyParamsNoEndpoint: ikkanServerBridgeBodyParamsNoEndpoint,
    bodyParamsWithEndpoint: ikkanServerBridgeBodyParamsWithEndpoint,
    searchParamsNoEndpoint: ikkanServerBridgeSearchParamsNoEndpoint,
    searchParamsWithEndpoint: ikkanServerBridgeSearchParamsWithEndpoint,
  });

  return handler as IkkanServerBridgeHandler<Output, Schema, Segments>;
}
