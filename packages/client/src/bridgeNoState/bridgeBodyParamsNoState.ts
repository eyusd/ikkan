import {
  IkkanHandlerParams,
  JsonValue,
  makeFetcherBodyParams,
  NextHTTPMethod,
} from "@ikkan/core";
import { z } from "zod";
import { WaterfallFunction } from "../types";
import { makeOperator, Operator } from "../utils";
import { IkkanClientBridgeNoStateHook } from "./types";

export function ikkanClientBridgeBodyParamsNoState<
  Endpoint extends string,
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType | undefined = undefined,
  Mut extends [string, unknown][] = [],
>(
  { method }: IkkanHandlerParams<Method, Output, Schema>,
  waterfall: {
    [K in keyof Mut]: WaterfallFunction<Mut[K][0], Output, Mut[K][1]>;
  },
): IkkanClientBridgeNoStateHook<Endpoint, Method, Output, Schema> {
  const fetcher = makeFetcherBodyParams<Endpoint, Method, Output, Schema>(
    method,
  );

  return (url: Endpoint) => {
    const operator = makeOperator<Endpoint, Output, Schema, Mut>(
      url,
      fetcher,
      waterfall,
    );

    return { [method]: operator } as ReturnType<
      IkkanClientBridgeNoStateHook<Endpoint, Method, Output, Schema>
    >;
  };
}
