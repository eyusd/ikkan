import {
  Fetcher,
  FetcherParams,
  FetcherParamsEmptyEndpoint,
  JsonValue,
  makeCommonError,
  NextHTTPMethod,
} from "@ikkan/core";
import { z } from "zod";
import { WaterfallFunction } from "./types";
import { mutate } from "swr";

export type WaterfallOperator<
  Output extends JsonValue,
  Schema extends z.ZodType | undefined = undefined,
> = (
  ...args: Schema extends undefined
    ? [options?: RequestInit]
    : [params: z.infer<Exclude<Schema, undefined>>, options?: RequestInit]
) => Promise<Output>;

export function makeWaterfallOperator<
  EndpointGenerator extends (...args: unknown[]) => string,
  Output extends JsonValue,
  Schema extends z.ZodType | undefined = undefined,
  Mut extends [string, unknown][] = [],
>(
  fetcherArgs: Parameters<EndpointGenerator>,
  fetcher: Fetcher<EndpointGenerator, Output, Schema>,
  waterfall: {
    [K in keyof Mut]: WaterfallFunction<Mut[K][0], Output, Mut[K][1]>;
  },
): WaterfallOperator<Output, Schema> {
  return async (...args: FetcherParamsEmptyEndpoint<Schema>) => {
    try {
      const fullArgs = fetcherArgs.concat(args) as FetcherParams<
        EndpointGenerator,
        Schema
      >;
      const response = await fetcher(...fullArgs);

      // iterate over the waterfall
      await Promise.all(
        waterfall.map(async (waterfallFunction) => {
          const { endpoint, mutator } = waterfallFunction(response);
          return await mutate(endpoint, mutator, {
            populateCache: true,
            revalidate: false,
            rollbackOnError: true,
          });
        }),
      );

      return response;
    } catch (error) {
      throw makeCommonError("requestError", error).toJSON();
    }
  };
}
