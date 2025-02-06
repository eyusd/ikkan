import { z } from "zod";
import { NextHTTPMethod } from "./next";
import { IkkanConfig, JsonValue } from "./types";

export * from "./errors";
export * from "./next";
export * from "./types";
export * from "./fetcher";
export * from "./utils";

export function ikkanConfig<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType | undefined = undefined,
  EndpointArgs extends
    | Record<string, string | string[]>
    | undefined = undefined,
>(
  config: IkkanConfig<Method, Output, Schema, EndpointArgs>,
): IkkanConfig<Method, Output, Schema, EndpointArgs> {
  return config;
}
