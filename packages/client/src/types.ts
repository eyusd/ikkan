import { JsonValue, NextHTTPMethod } from "@ikkan/core";
import { z } from "zod";
import { IkkanClientBridgeWithStateHook } from "./bridgeWithState";
import { IkkanClientBridgeNoStateHook } from "./bridgeNoState";

export type WaterfallFunction<Endpoint extends string, Output, CachedType> = (
  returnValue: Output,
) => {
  endpoint: Endpoint;
  mutator: (cachedValue: CachedType | undefined) => CachedType | undefined;
};

export type IkkanClientBridgeHandler<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType | undefined,
  EndpointArgs extends Record<string, string | string[]> | undefined,
  UseState extends boolean = false,
> = UseState extends true
  ? IkkanClientBridgeWithStateHook<Output, Schema, EndpointArgs>
  : IkkanClientBridgeNoStateHook<Method, Output, Schema, EndpointArgs>;
  