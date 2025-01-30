import { JsonValue, NextHTTPMethod } from "@ikkan/core";
import { WaterfallOperator } from "../utils";
import { z } from "zod";

export type IkkanClientBridgeNoStateHook<
  EndpointGenerator extends (...args: unknown[]) => string,
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType | undefined = undefined,
> = (...args: Parameters<EndpointGenerator>) => {
  [key in Method]: WaterfallOperator<Output, Schema>;
};
