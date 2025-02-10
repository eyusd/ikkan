import { IkkanFetcher } from "@ikkan/core";
import { JsonValue } from "@ikkan/core";
import { z } from "zod";

/**
 * Represents a handler for the Ikkan server bridge.
 *
 * @template Output - The type of the output value, which extends `JsonValue`.
 * @template Schema - The schema type, which extends `z.ZodType` or can be `undefined`.
 * @template EndpointArgs - The type of the endpoint arguments, which extends a record of strings or string arrays, or can be `undefined`.
 *
 * @param args - The endpoint arguments. If `EndpointArgs` is a record of strings or string arrays, this parameter is required.
 *
 * @returns An instance of `IkkanFetcher` with the specified `Output`, `Schema`, and `undefined`.
 */
export type IkkanServerBridgeHandler<
  Output extends JsonValue,
  Schema extends z.ZodType | undefined,
  EndpointArgs extends Record<string, string | string[]> | undefined,
> = (
  ...args: EndpointArgs extends Record<string, string | string[]>
    ? [args: EndpointArgs]
    : []
) => IkkanFetcher<Output, Schema, undefined>;

/**
 * Extracts the schema type from an `IkkanServerBridgeHandler`.
 *
 * This utility type takes a generic type `T` and checks if it extends
 * `IkkanServerBridgeHandler` with specific type parameters. If it does,
 * it extracts the `Schema` type parameter and checks if it extends `z.ZodType`.
 * If `Schema` extends `z.ZodType`, it returns `Schema`; otherwise, it returns `never`.
 *
 * @template T - The type to extract the schema from.
 * @returns The schema type if `T` extends `IkkanServerBridgeHandler` and `Schema` extends `z.ZodType`, otherwise `never`.
 */
export type IkkanSchema<T> =
  T extends IkkanServerBridgeHandler<
    infer _Output,
    infer Schema,
    infer _EndpointArgs
  >
    ? Schema extends z.ZodType
      ? Schema
      : never
    : never;
