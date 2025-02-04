import { z } from "zod";
import { JsonValue } from "../types";

type FetcherParamsNoEndpointArgs<
  Schema extends z.ZodType | undefined = undefined,
> = Schema extends z.ZodType
  ? [params: z.infer<Schema>, options?: RequestInit]
  : [options?: RequestInit];

type FetcherParamsWithEndpointArgs<
  Schema extends z.ZodType | undefined,
  EndpointArgs extends Record<string, string | string[]>,
> = Schema extends z.ZodType
  ? [args: EndpointArgs, params: z.infer<Schema>, options?: RequestInit]
  : [args: EndpointArgs, options?: RequestInit];

export type FetcherParams<
  Schema extends z.ZodType | undefined,
  EndpointArgs extends Record<string, string | string[]> | undefined,
> =
  EndpointArgs extends Record<string, string | string[]>
    ? FetcherParamsWithEndpointArgs<Schema, EndpointArgs>
    : FetcherParamsNoEndpointArgs<Schema>;

export type Fetcher<
  Output extends JsonValue,
  Schema extends z.ZodType | undefined,
  EndpointArgs extends Record<string, string | string[]> | undefined,
> = (...args: FetcherParams<Schema, EndpointArgs>) => Promise<Output>;
