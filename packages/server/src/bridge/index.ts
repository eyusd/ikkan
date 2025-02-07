import {
  branchHandler,
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
>(
  config: IkkanConfig<Method, Output, Schema, EndpointArgs>,
): IkkanServerBridgeHandler<Output, Schema, EndpointArgs> {
  const handler = branchHandler(config, [], {
    noSchemaNoEndpoint: ikkanServerBridgeNoSchemaNoEndpoint,
    noSchemaWithEndpoint: ikkanServerBridgeNoSchemaWithEndpoint,
    bodyParamsNoEndpoint: ikkanServerBridgeBodyParamsNoEndpoint,
    bodyParamsWithEndpoint: ikkanServerBridgeBodyParamsWithEndpoint,
    searchParamsNoEndpoint: ikkanServerBridgeSearchParamsNoEndpoint,
    searchParamsWithEndpoint: ikkanServerBridgeSearchParamsWithEndpoint,
  });

  return handler as IkkanServerBridgeHandler<Output, Schema, EndpointArgs>;
}
