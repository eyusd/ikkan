import { Fetcher } from "@ikkan/core";
import { JsonValue } from "@ikkan/core";
import { z } from "zod";

export type IkkanServerBridgeHandler<
  Output extends JsonValue,
  Schema extends z.ZodType | undefined,
  EndpointArgs extends Record<string, string | string[]> | undefined,
> = (
    ...args: EndpointArgs extends Record<string, string | string[]>
      ? [EndpointArgs]
      : []
  ) => Fetcher<Output, Schema, undefined>;
