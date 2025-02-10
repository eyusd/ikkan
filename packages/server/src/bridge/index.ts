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
