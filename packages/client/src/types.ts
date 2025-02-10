import { JsonValue, NextHTTPMethod } from "@ikkan/core";
import { z } from "zod";
import { IkkanClientBridgeWithStateHook } from "./bridgeWithState";
import { IkkanClientBridgeNoStateHook } from "./bridgeNoState";

/**
 * Represents a handler for the Ikkan client bridge.
 *
 * @template Method - The HTTP method type (e.g., GET, POST) that extends `NextHTTPMethod`.
 * @template Output - The type of the output data that extends `JsonValue`.
 * @template Schema - The validation schema type that extends `z.ZodType` or can be `undefined`.
 * @template EndpointArgs - The type of the endpoint arguments that extends a record of strings or string arrays, or can be `undefined`.
 *
 * @property {IkkanClientBridgeWithStateHook<Output, Schema, EndpointArgs>} hook - The hook for handling stateful operations.
 * @property {IkkanClientBridgeNoStateHook<Method, Output, Schema, EndpointArgs>} action - The action for handling stateless operations.
 */
export type IkkanClientBridgeHandler<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType | undefined,
  EndpointArgs extends Record<string, string | string[]> | undefined,
> = {
  hook: IkkanClientBridgeWithStateHook<Output, Schema, EndpointArgs>;
  action: IkkanClientBridgeNoStateHook<Method, Output, Schema, EndpointArgs>;
};

/**
 * Extracts the schema type from an Ikkan client bridge type.
 *
 * This utility type takes a generic type `T` and checks if it extends either
 * `IkkanClientBridgeWithStateHook` or `IkkanClientBridgeNoStateHook`. If it does,
 * it extracts the `Schema` type from the bridge type and checks if it extends
 * `z.ZodType`. If the `Schema` type extends `z.ZodType`, it returns the `Schema`
 * type; otherwise, it returns `never`.
 *
 * @template T - The type from which to extract the schema.
 */
export type IkkanSchema<T> = T extends
  | IkkanClientBridgeWithStateHook<
      infer _Output,
      infer Schema,
      infer _EndpointArgs
    >
  | IkkanClientBridgeNoStateHook<
      infer _Method,
      infer _Output,
      infer Schema,
      infer _EndpointArgs
    >
  ? Schema extends z.ZodType
    ? Schema
    : never
  : never;
