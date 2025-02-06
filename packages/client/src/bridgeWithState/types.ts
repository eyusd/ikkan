import { IkkanFetcherParams, JsonValue, SerializedAPIError } from "@ikkan/core";
import { z } from "zod";

export type IkkanClientBridgeWithStateHook<
  Output extends JsonValue,
  Schema extends z.ZodType | undefined,
  EndpointArgs extends Record<string, string | string[]> | undefined,
> = (
  ...args: EndpointArgs extends Record<string, string | string[]>
    ? [EndpointArgs]
    : []
) => (...params: IkkanFetcherParams<Schema, undefined>) => {
  data: Output | undefined;
  error: SerializedAPIError | undefined;
};
