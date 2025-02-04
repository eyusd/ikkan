import { Fetcher, FetcherParams, JsonValue } from "@ikkan/core";
import { z } from "zod";

export function partializeFetcherNoEndpoint<
  Output extends JsonValue,
  Schema extends z.ZodType | undefined,
  EndpointArgs extends undefined,
>(fetcher: Fetcher<Output, Schema, EndpointArgs>) {
  return () => {
    return async function fetcherPartialized(
      ...args: FetcherParams<Schema, EndpointArgs>
    ): Promise<Output> {
      return await fetcher(...args);
    } as Fetcher<Output, Schema, undefined>;
  }
}

export function partializeFetcherWithEndpoint<
  Output extends JsonValue,
  Schema extends z.ZodType | undefined,
  EndpointArgs extends Record<string, string | string[]>,
>(
  fetcher: Fetcher<Output, Schema, EndpointArgs>
) {
  return (args: EndpointArgs) => {
    return async function fetcherPartialized(
      ...params: FetcherParams<Schema, EndpointArgs>
    ): Promise<Output> {
      // @ts-ignore - this is a hack to make the types work
      return await fetcher(args, ...params);
    } as Fetcher<Output, Schema, undefined>;
  }
}