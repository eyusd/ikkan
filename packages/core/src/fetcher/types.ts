import { z } from "zod";
import { JsonValue } from "../types";

type IkkanFetcherParamsNoSegments<Schema extends z.ZodType | undefined> =
  Schema extends z.ZodType
    ? [params: z.infer<Schema>, options?: RequestInit]
    : [options?: RequestInit];

type IkkanFetcherParamsWithSegments<
  Schema extends z.ZodType | undefined,
  Segments extends Record<string, string | string[]>,
> = Schema extends z.ZodType
  ? [segments: Segments, params: z.infer<Schema>, options?: RequestInit]
  : [segments: Segments, options?: RequestInit];

export type IkkanFetcherParams<
  Schema extends z.ZodType | undefined,
  Segments extends Record<string, string | string[]> | undefined,
> =
  Segments extends Record<string, string | string[]>
    ? IkkanFetcherParamsWithSegments<Schema, Segments>
    : IkkanFetcherParamsNoSegments<Schema>;

export type IkkanFetcher<
  Output extends JsonValue,
  Schema extends z.ZodType | undefined,
  Segments extends Record<string, string | string[]> | undefined,
> = (...args: IkkanFetcherParams<Schema, Segments>) => Promise<Output>;
