import { IkkanHandlerParams, JsonValue, NextHTTPMethod } from "@ikkan/core";
import { z } from "zod";
import { WaterfallFunction } from "./types";
import { IkkanClientBridgeWithStateHook } from "./bridgeWithState/types";
import { IkkanClientBridgeNoStateHook } from "./bridgeNoState/types";
import { ikkanBridgeWithState } from "./bridgeWithState";
import { ikkanBridgeNoState } from "./bridgeNoState";

type IkkanClientBridgeHook<
  EndpointGenerator extends (...args: unknown[]) => string,
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType | undefined = undefined,
> =
  | IkkanClientBridgeWithStateHook<EndpointGenerator, Output, Schema>
  | IkkanClientBridgeNoStateHook<EndpointGenerator, Method, Output, Schema>;

export function ikkanClientBridge<
  EndpointGenerator extends (...args: unknown[]) => string,
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType | undefined = undefined,
  Mut extends [string, unknown][] = [],
>(
  params: IkkanHandlerParams<EndpointGenerator, Method, Output, Schema>,
  state: boolean,
  waterfall: {
    [K in keyof Mut]: WaterfallFunction<Mut[K][0], Output, Mut[K][1]>;
  },
): IkkanClientBridgeHook<EndpointGenerator, Method, Output, Schema> {
  if (state) {
    return ikkanBridgeWithState(params, waterfall);
  } else {
    return ikkanBridgeNoState(params, waterfall);
  }
}
