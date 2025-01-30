import {
  IkkanHandlerParams,
  JsonValue,
  makeFetcherNoSchema,
  makeFetcherSearchParams,
  NextHTTPMethod,
} from "@ikkan/core";
import { z } from "zod";

export function ikkanServerBridgeSearchParams<
  Endpoint extends (...args: unknown[]) => string,
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType | undefined = undefined,
>(params: IkkanHandlerParams<Endpoint, Method, Output, Schema>) {
  const { endpoint, method } = params;

  if ("schema" in params) {
    return makeFetcherSearchParams<
      Endpoint,
      Method,
      Output,
      Schema & z.ZodType
    >(endpoint, method);
  } else {
    return makeFetcherNoSchema<Endpoint, Method, Output, Schema & undefined>(
      endpoint,
      method,
    );
  }
}
