import { IkkanHandlerParams, JsonValue, methodHandler, NextHTTPMethod } from "@ikkan/core";
import { z } from "zod";
import { WaterfallFunction } from "./types";
import { ikkanClientBridgeBodyParamsWithState, ikkanClientBridgeSearchParamsWithState } from "./bridgeWithState";
import { ikkanClientBridgeBodyParamsNoState, ikkanClientBridgeSearchParamsNoState } from "./bridgeNoState";

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
  }
) {
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
