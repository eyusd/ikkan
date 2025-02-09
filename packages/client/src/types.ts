import { JsonValue, NextHTTPMethod } from "@ikkan/core";
import { z } from "zod";
import { IkkanClientBridgeWithStateHook } from "./bridgeWithState";
import { IkkanClientBridgeNoStateHook } from "./bridgeNoState";

export type IkkanClientBridgeHandler<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType | undefined,
  EndpointArgs extends Record<string, string | string[]> | undefined,
> = {
  hook: IkkanClientBridgeWithStateHook<Output, Schema, EndpointArgs>;
  action: IkkanClientBridgeNoStateHook<Method, Output, Schema, EndpointArgs>;
};

export type IkkanSchema<T> = T extends
  | IkkanClientBridgeWithStateHook<infer _Output, infer Schema, infer _EndpointArgs>
  | IkkanClientBridgeNoStateHook<infer _Method, infer _Output, infer Schema, infer _EndpointArgs>
  ? Schema extends z.ZodType
    ? Schema
    : never
  : never;
