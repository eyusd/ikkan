import { JsonValue } from "@ikkan/core";
import { z } from "zod";

export type IkkanServerBridgeHandler<
  Endpoint extends string,
  Output extends JsonValue,
  Schema extends z.ZodType | undefined = undefined,
> = (
  url: Endpoint,
  params: Schema extends undefined
    ? undefined
    : z.infer<Exclude<Schema, undefined>>,
  options?: RequestInit,
) => Promise<Output>;
