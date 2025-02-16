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
  Segments extends
    | Record<string, string | string[]>
    | undefined = undefined,
  SSI extends (() => Promise<any>) | undefined = undefined,
>(
  config: IkkanConfig<Method, Output, Schema, Segments, SSI>,
): IkkanConfig<Method, Output, Schema, Segments, SSI> {
  return config;
}
