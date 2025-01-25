import { JsonValue, SerializedAPIError } from "@ikkan/core";
import { z } from "zod";

export type IkkanClientBridgeWithStateHook<
  Endpoint extends string,
  Output extends JsonValue,
  Schema extends z.ZodType | undefined = undefined,
> = (
  url: Endpoint | null,
  params: Schema extends undefined
    ? undefined
    : z.infer<Exclude<Schema, undefined>>,
  options?: RequestInit,
) => {
  data: Output | undefined;
  error: SerializedAPIError | undefined;
};
