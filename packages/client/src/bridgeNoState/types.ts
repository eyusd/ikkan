import { JsonValue, NextHTTPMethod } from "@ikkan/core";
import { Operator } from "../utils";
import { z } from "zod";

export type IkkanClientBridgeNoStateHook<
  Endpoint extends string,
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType | undefined = undefined,
> = (url: Endpoint) => {
  [key in Method]: Operator<Output, Schema>;
};
