import { z } from "zod";
import { JsonValue } from "../types";

export type Fetcher<
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
