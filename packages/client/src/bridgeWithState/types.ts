import { IkkanFetcherParams, JsonValue, SerializedAPIError } from "@ikkan/core";
import { z } from "zod";

export type IkkanClientBridgeWithStateHook<
  Output extends JsonValue,
  Schema extends z.ZodType | undefined,
  Segments extends Record<string, string | string[]> | undefined,
> = (
  ...args: Segments extends Record<string, string | string[]>
    ? [segments: Segments]
    : []
) => (...args: IkkanFetcherParams<Schema, undefined>) => {
  data: Output | undefined;
  error: SerializedAPIError | undefined;
};
