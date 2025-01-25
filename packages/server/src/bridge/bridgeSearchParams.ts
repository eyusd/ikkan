import {
  IkkanHandlerParams,
  JsonValue,
  makeFetcherSearchParams,
  NextHTTPMethod,
} from "@ikkan/core";
import { z } from "zod";

export function ikkanServerBridgeSearchParams<
  Endpoint extends string,
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType | undefined = undefined
>({ method }: IkkanHandlerParams<Method, Output, Schema>) {
  const fetcher = makeFetcherSearchParams<Endpoint, Method, Output, Schema>(
    method
  );

  return fetcher;
}
