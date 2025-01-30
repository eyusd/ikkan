import { z } from "zod";
import { JsonValue } from "../types";

export type FetcherParamsEmptyEndpoint<Schema extends z.ZodType | undefined> =
  Schema extends undefined
    ? [options?: RequestInit]
    : [params: z.infer<Exclude<Schema, undefined>>, options?: RequestInit];

export type FetcherParamsNonEmptyEndpoint<
  EndpointGenerator extends (...args: [unknown, ...unknown[]]) => string,
  Schema extends z.ZodType | undefined,
> = Schema extends undefined
  ? [args: Parameters<EndpointGenerator>, options?: RequestInit]
  : [
      args: Parameters<EndpointGenerator>,
      params: z.infer<Exclude<Schema, undefined>>,
      options?: RequestInit,
    ];

export type FetcherParams<
  EndpointGenerator extends (...args: unknown[]) => string,
  Schema extends z.ZodType | undefined = undefined,
> =
  Parameters<EndpointGenerator> extends []
    ? FetcherParamsEmptyEndpoint<Schema>
    : FetcherParamsNonEmptyEndpoint<EndpointGenerator, Schema>;

export type Fetcher<
  EndpointGenerator extends (...args: unknown[]) => string,
  Output extends JsonValue,
  Schema extends z.ZodType | undefined = undefined,
> = (...args: FetcherParams<EndpointGenerator, Schema>) => Promise<Output>;
