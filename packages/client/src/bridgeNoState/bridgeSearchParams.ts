import {
  IkkanHandlerParams,
  JsonValue,
  makeFetcherSearchParams,
  NextHTTPMethod,
} from "@ikkan/core";
import { z } from "zod";
import { WaterfallFunction } from "../types";
import { makeWaterfallOperator } from "../utils";
import { IkkanClientBridgeNoStateHook } from "./types";

export function bridgeSearchParams<
  EndpointGenerator extends (...args: unknown[]) => string,
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType,
  Mut extends [string, unknown][] = [],
>(
  params: IkkanHandlerParams<EndpointGenerator, Method, Output, Schema>,
  waterfall: {
    [K in keyof Mut]: WaterfallFunction<Mut[K][0], Output, Mut[K][1]>;
  },
): IkkanClientBridgeNoStateHook<EndpointGenerator, Method, Output, Schema> {
  const { endpoint, method } = params;
  const fetcher = makeFetcherSearchParams<
    EndpointGenerator,
    Method,
    Output,
    Schema
  >(endpoint, method);

  return (...args: Parameters<EndpointGenerator>) => {
    const operator = makeWaterfallOperator<
      EndpointGenerator,
      Output,
      Schema,
      Mut
    >(args, fetcher, waterfall);

    return { [method]: operator } as ReturnType<
      IkkanClientBridgeNoStateHook<EndpointGenerator, Method, Output, Schema>
    >;
  };
}
