import {
  IkkanHandlerParams,
  JsonValue,
  makeFetcherBodyParams,
  NextHTTPMethod,
} from "@ikkan/core";
import { z } from "zod";

export function ikkanServerBridgeBodyParams<
  Method extends NextHTTPMethod,
  Endpoint extends string,
  Output extends JsonValue,
  Schema extends z.ZodType | undefined = undefined
>({ method }: IkkanHandlerParams<Method, Output, Schema>) {
  const fetcher = makeFetcherBodyParams<Endpoint, Method, Output, Schema>(
    method
  );

  return fetcher;
}
