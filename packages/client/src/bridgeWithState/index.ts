import {
  IkkanHandlerParams,
  JsonValue,
  methodHandler,
  NextHTTPMethod,
} from "@ikkan/core";
import { WaterfallFunction } from "../types";
import { z } from "zod";
import { IkkanClientBridgeWithStateHook } from "./types";
import { bridgeBodyParams } from "./bridgeBodyParams";
import { bridgeSearchParams } from "./bridgeSearchParams";
import { bridgeNoSchema } from "./bridgeNoSchema";

export function ikkanBridgeWithState<
  EndpointGenerator extends (...args: unknown[]) => string,
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType | undefined = undefined,
  Mut extends [string, unknown][] = [],
>(
  params: IkkanHandlerParams<EndpointGenerator, Method, Output, Schema>,
  waterfall: {
    [K in keyof Mut]: WaterfallFunction<Mut[K][0], Output, Mut[K][1]>;
  },
): IkkanClientBridgeWithStateHook<EndpointGenerator, Output, Schema> {
  const { method } = params;

  if ("schema" in params) {
    return methodHandler(method, {
      body: bridgeBodyParams<
        EndpointGenerator,
        Method,
        Output,
        Schema & z.ZodType,
        Mut
      >(
        params as IkkanHandlerParams<
          EndpointGenerator,
          Method,
          Output,
          Schema & z.ZodType
        >,
        waterfall,
      ),
      search: bridgeSearchParams<
        EndpointGenerator,
        Method,
        Output,
        Schema & z.ZodType,
        Mut
      >(
        params as IkkanHandlerParams<
          EndpointGenerator,
          Method,
          Output,
          Schema & z.ZodType
        >,
        waterfall,
      ),
    }) as IkkanClientBridgeWithStateHook<EndpointGenerator, Output, Schema>;
  } else {
    return bridgeNoSchema<
      EndpointGenerator,
      Method,
      Output,
      Schema & undefined,
      Mut
    >(
      params as IkkanHandlerParams<
        EndpointGenerator,
        Method,
        Output,
        Schema & undefined
      >,
      waterfall,
    ) as IkkanClientBridgeWithStateHook<EndpointGenerator, Output, Schema>;
  }
}
