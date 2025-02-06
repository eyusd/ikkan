import { z } from "zod";
import { JsonValue } from "../types";

type IkkanFetcherParamsNoEndpointArgs<Schema extends z.ZodType | undefined> =
  Schema extends z.ZodType
    ? [params: z.infer<Schema>, options?: RequestInit]
    : [options?: RequestInit];

type IkkanFetcherParamsWithEndpointArgs<
  Schema extends z.ZodType | undefined,
  EndpointArgs extends Record<string, string | string[]>,
> = Schema extends z.ZodType
  ? [args: EndpointArgs, params: z.infer<Schema>, options?: RequestInit]
  : [args: EndpointArgs, options?: RequestInit];

export type IkkanFetcherParams<
  Schema extends z.ZodType | undefined,
  EndpointArgs extends Record<string, string | string[]> | undefined,
> =
  EndpointArgs extends Record<string, string | string[]>
    ? IkkanFetcherParamsWithEndpointArgs<Schema, EndpointArgs>
    : IkkanFetcherParamsNoEndpointArgs<Schema>;

export type IkkanFetcher<
  Output extends JsonValue,
  Schema extends z.ZodType | undefined,
  EndpointArgs extends Record<string, string | string[]> | undefined,
> = (...args: IkkanFetcherParams<Schema, EndpointArgs>) => Promise<Output>;
