import { IkkanFetcher, JsonValue, NextHTTPMethod } from "@ikkan/core";
import { z } from "zod";

export type IkkanClientBridgeNoStateHook<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType | undefined,
  Segments extends Record<string, string | string[]> | undefined,
> = (
  ...args: Segments extends Record<string, string | string[]>
    ? [args: Segments]
    : []
) => {
  [key in Lowercase<Method>]: IkkanFetcher<Output, Schema, undefined>;
};
