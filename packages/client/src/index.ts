import { IkkanHandlerParams, JsonValue, NextHTTPMethod } from "@ikkan/core";
import { z } from "zod";
import { IkkanClientBridgeHandler, WaterfallFunction } from "./types";
import { ikkanBridgeWithState } from "./bridgeWithState";
import { ikkanBridgeNoState } from "./bridgeNoState";


export function ikkanClientBridge<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType | undefined,
  EndpointArgs extends Record<string, string | string[]> | undefined,
  Mut extends [string, unknown][],
  UseState extends boolean,
>(
  params: IkkanHandlerParams<Method, Output, Schema, EndpointArgs>,
  state: UseState,
  waterfall: {
    [K in keyof Mut]: WaterfallFunction<Mut[K][0], Output, Mut[K][1]>;
  } = {} as any,
): IkkanClientBridgeHandler<Method, Output, Schema, EndpointArgs, UseState> {
  if (state) {
    return ikkanBridgeWithState(params, waterfall) as IkkanClientBridgeHandler<Method, Output, Schema, EndpointArgs, UseState>;
  } else {
    return ikkanBridgeNoState(params, waterfall)  as IkkanClientBridgeHandler<Method, Output, Schema, EndpointArgs, UseState>;
  }
}
