import { IkkanFetcher, IkkanFetcherParams, JsonValue } from "@ikkan/core";
import { z } from "zod";

export function partializeFetcherNoEndpoint<
  Output extends JsonValue,
  Schema extends z.ZodType | undefined,
>(fetcher: IkkanFetcher<Output, Schema, undefined>) {
  return () => {
    return async function fetcherPartialized(
      ...args: IkkanFetcherParams<Schema, undefined>
    ): Promise<Output> {
      return await fetcher(...args);
    } as IkkanFetcher<Output, Schema, undefined>;
  };
}

export function partializeFetcherWithEndpoint<
  Output extends JsonValue,
  Schema extends z.ZodType | undefined,
  Segments extends Record<string, string | string[]>,
>(fetcher: IkkanFetcher<Output, Schema, Segments>) {
  return (segments: Segments) => {
    return async function fetcherPartialized(
      ...args: IkkanFetcherParams<Schema, undefined>
    ): Promise<Output> {
      return await fetcher(...([segments, ...args] as any));
    } as IkkanFetcher<Output, Schema, undefined>;
  };
}
