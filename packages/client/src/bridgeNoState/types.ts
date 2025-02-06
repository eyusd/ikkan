import { IkkanFetcher, JsonValue, NextHTTPMethod } from "@ikkan/core";
import { z } from "zod";

export type IkkanClientBridgeNoStateHook<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType | undefined,
  EndpointArgs extends Record<string, string | string[]> | undefined,
> = (
  ...args: EndpointArgs extends Record<string, string | string[]>
    ? [EndpointArgs]
    : []
) => {
  [key in Method]: IkkanFetcher<Output, Schema, undefined>;
};
