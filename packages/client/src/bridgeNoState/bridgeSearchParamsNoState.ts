import { IkkanHandlerParams, JsonValue, makeFetcherSearchParams, NextHTTPMethod } from "@ikkan/core";
import { z } from "zod";
import { WaterfallFunction } from "../types";
import { makeOperator } from "../utils";
import { IkkanClientBridgeNoStateHook } from "./types";

export function ikkanClientBridgeSearchParamsNoState<
  Endpoint extends string,
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType | undefined = undefined,
  Mut extends [string, unknown][] = [],
>(
  { method }: IkkanHandlerParams<Method, Output, Schema>,
  waterfall: {
    [K in keyof Mut]: WaterfallFunction<Mut[K][0], Output, Mut[K][1]>;
  }
): IkkanClientBridgeNoStateHook<Endpoint, Method, Output, Schema> {
  const fetcher = makeFetcherSearchParams<Endpoint, Method, Output, Schema>(
    method,
  );

  return (url: Endpoint) => {
    const operator = makeOperator<Endpoint, Output, Schema, Mut>(
      url,
      fetcher,
      waterfall,
    );

    return { [method]: operator } as ReturnType<IkkanClientBridgeNoStateHook<Endpoint, Method, Output, Schema>>;
  };
}
