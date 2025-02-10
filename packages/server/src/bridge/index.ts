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
 * @template EndpointArgs - The type of endpoint arguments, or undefined if no arguments are used.
 * @template ServerSideImports - The type of server-side imports, or undefined if no imports are used.
 *
 * @param {IkkanConfig<Method, Output, Schema, EndpointArgs, ServerSideImports>} config - The configuration object for the server bridge.
 * @returns {IkkanServerBridgeHandler<Output, Schema, EndpointArgs>} The server bridge handler.
 */
export function ikkanServerBridge<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType | undefined,
  EndpointArgs extends Record<string, string | string[]> | undefined,
  ServerSideImports extends (() => Promise<any>) | undefined,
>(
  config: IkkanConfig<Method, Output, Schema, EndpointArgs, ServerSideImports>,
): IkkanServerBridgeHandler<Output, Schema, EndpointArgs> {
  const handler = schemaEndpointBranch(config, [], {
    noSchemaNoEndpoint: ikkanServerBridgeNoSchemaNoEndpoint,
    noSchemaWithEndpoint: ikkanServerBridgeNoSchemaWithEndpoint,
    bodyParamsNoEndpoint: ikkanServerBridgeBodyParamsNoEndpoint,
    bodyParamsWithEndpoint: ikkanServerBridgeBodyParamsWithEndpoint,
    searchParamsNoEndpoint: ikkanServerBridgeSearchParamsNoEndpoint,
    searchParamsWithEndpoint: ikkanServerBridgeSearchParamsWithEndpoint,
  });

  return handler as IkkanServerBridgeHandler<Output, Schema, EndpointArgs>;
}
