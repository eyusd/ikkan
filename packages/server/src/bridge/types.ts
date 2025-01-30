import { Fetcher } from "@ikkan/core";
import { JsonValue } from "@ikkan/core";
import { z } from "zod";

export type IkkanServerBridgeHandler<
  Endpoint extends (...args: unknown[]) => string,
  Output extends JsonValue,
  Schema extends z.ZodType | undefined = undefined,
> = Fetcher<Endpoint, Output, Schema>;
