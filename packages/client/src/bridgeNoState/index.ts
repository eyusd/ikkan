import {
  branchHandler,
  IkkanHandlerParams,
  JsonValue,
  NextHTTPMethod,
} from "@ikkan/core";
import { WaterfallFunction } from "../types";
import { z } from "zod";
import { IkkanClientBridgeNoStateHook } from "./types";
import { bridgeNoSchemaNoEndpoint, bridgeNoSchemaWithEndpoint } from "./bridgeNoSchema";
import { bridgeBodyParamsNoEndpoint, bridgeBodyParamsWithEndpoint } from "./bridgeBodyParams";
import { bridgeSearchParamsNoEndpoint, bridgeSearchParamsWithEndpoint } from "./bridgeSearchParams";

export { type IkkanClientBridgeNoStateHook } from "./types";
export function ikkanBridgeNoState<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType | undefined,
  EndpointArgs extends Record<string, string | string[]> | undefined,
  Mut extends [string, unknown][],
>(
  params: IkkanHandlerParams<Method, Output, Schema, EndpointArgs>,
  waterfall: {
    [K in keyof Mut]: WaterfallFunction<Mut[K][0], Output, Mut[K][1]>;
  },
): IkkanClientBridgeNoStateHook<Method, Output, Schema, EndpointArgs> {
  const handler = branchHandler(params, [waterfall], {
    noSchemaNoEndpoint: bridgeNoSchemaNoEndpoint,
    noSchemaWithEndpoint: bridgeNoSchemaWithEndpoint,
    bodyParamsNoEndpoint: bridgeBodyParamsNoEndpoint,
    bodyParamsWithEndpoint: bridgeBodyParamsWithEndpoint,
    searchParamsNoEndpoint: bridgeSearchParamsNoEndpoint,
    searchParamsWithEndpoint: bridgeSearchParamsWithEndpoint
  })

  return handler as IkkanClientBridgeNoStateHook<Method, Output, Schema, EndpointArgs>;
}
