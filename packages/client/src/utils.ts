import { Fetcher, FetcherParams, JsonValue, makeCommonError } from "@ikkan/core";
import { z } from "zod";
import { WaterfallFunction } from "./types";
import { mutate } from "swr";

async function cascade<
  Output extends JsonValue,
  Mut extends [string, unknown][],
>(
  response: Output,
  waterfall: {
    [K in keyof Mut]: WaterfallFunction<Mut[K][0], Output, Mut[K][1]>;
  },
) {
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
}


export function waterfallNoEndpoint<
  Output extends JsonValue,
  Schema extends z.ZodType | undefined,
  EndpointArgs extends undefined,
  Mut extends [string, unknown][],
  TransformResult
>(
  fetcher: Fetcher<Output, Schema, EndpointArgs>,
  waterfall: {
    [K in keyof Mut]: WaterfallFunction<Mut[K][0], Output, Mut[K][1]>;
  },
  transform: (partializedFetcher: Fetcher<Output, Schema, undefined>) => TransformResult
) {
  return () => {
    const partializedFetcher: Fetcher<Output, Schema, undefined> = async (
      ...params: FetcherParams<Schema, undefined>
    ): Promise<Output> => {
      try {
        const response = await (fetcher as Fetcher<Output, Schema, undefined>)(...params);
        await cascade(response, waterfall);
        return response;
      } catch (error) {
        throw makeCommonError("requestError", error).toJSON();
      }
    };

    return transform(partializedFetcher);
  }
}

export function waterfallWithEndpoint<
  Output extends JsonValue,
  Schema extends z.ZodType | undefined,
  EndpointArgs extends Record<string, string | string[]>,
  Mut extends [string, unknown][],
  TransformResult
>(
  fetcher: Fetcher<Output, Schema, EndpointArgs>,
  waterfall: {
    [K in keyof Mut]: WaterfallFunction<Mut[K][0], Output, Mut[K][1]>;
  },
  transform: (partializedFetcher: Fetcher<Output, Schema, undefined>, args: EndpointArgs) => TransformResult
) {
  return (args: EndpointArgs) => {
    const partializedFetcher: Fetcher<Output, Schema, undefined> = async (
      ...params: FetcherParams<Schema, undefined>
    ): Promise<Output> => {
      try {
        // @ts-ignore - this is a hack to make the types work
        const response = await fetcher(args, ...params);
        await cascade(response, waterfall);
        return response;
      } catch (error) {
        throw makeCommonError("requestError", error).toJSON();
      }
    }

    return transform(partializedFetcher, args);
  }
}
