import {
  IkkanFetcher,
  IkkanFetcherParams,
  isSerializedAPIError,
  JsonValue,
  makeCommonError,
} from "@ikkan/core";
import { z } from "zod";
import { mutate } from "swr";
import { FullArgs, IkkanSideEffects } from "./sideEffect";

// TODO: Refactor this so that waterfall can be created from a series of config + endpoint args + mutator
async function applySideEffects<
  Output extends JsonValue,
  Schema extends z.ZodType | undefined,
  Segments extends Record<string, string | string[]> | undefined,
  T extends JsonValue[],
>(
  fullArgs: FullArgs<Output, Schema, Segments>,
  sideEffects: IkkanSideEffects<T, Output, Schema, Segments>,
) {
  await Promise.all(
    sideEffects.map(async ({ mutator, urlGenerator }) => {
      const { output } = fullArgs;
      const url = urlGenerator(fullArgs);
      const operator: unknown = (cachedValue: unknown) => {
        // @ts-expect-error - variadic types are not supported
        return mutator(cachedValue, output);
      };
      return await mutate(url, operator, {
        populateCache: true,
        revalidate: false,
        rollbackOnError: true,
      });
    }),
  );
}

export function clientHookNoEndpoint<
  Output extends JsonValue,
  Schema extends z.ZodType | undefined,
  T extends JsonValue[],
  TransformResult,
>(
  fetcher: IkkanFetcher<Output, Schema, undefined>,
  sideEffects: IkkanSideEffects<T, Output, Schema, undefined>,
  transform: (
    partializedFetcher: IkkanFetcher<Output, Schema, undefined>,
  ) => TransformResult,
) {
  return () => {
    const partializedFetcher: IkkanFetcher<Output, Schema, undefined> = async (
      ...params: IkkanFetcherParams<Schema, undefined>
    ): Promise<Output> => {
      try {
        const response = await (
          fetcher as IkkanFetcher<Output, Schema, undefined>
        )(...params);
        const fullArgs = {
          output: response,
          params,
          segments: undefined,
        } as FullArgs<Output, Schema, undefined>;
        await applySideEffects(fullArgs, sideEffects);
        return response;
      } catch (error) {
        throw makeCommonError("requestError", error).toJSON();
      }
    };

    return transform(partializedFetcher);
  };
}

export function clientHookWithEndpoint<
  Output extends JsonValue,
  Schema extends z.ZodType | undefined,
  Segments extends Record<string, string | string[]>,
  T extends JsonValue[],
  TransformResult,
>(
  fetcher: IkkanFetcher<Output, Schema, Segments>,
  sideEffects: IkkanSideEffects<T, Output, Schema, Segments>,
  transform: (
    partializedFetcher: IkkanFetcher<Output, Schema, undefined>,
    args: Segments,
  ) => TransformResult,
) {
  return (segments: Segments) => {
    const partializedFetcher: IkkanFetcher<Output, Schema, undefined> = async (
      ...params: IkkanFetcherParams<Schema, undefined>
    ): Promise<Output> => {
      try {
        const response = await fetcher(...([segments, ...params] as any));
        const fullArgs = { output: response, params, segments } as FullArgs<
          Output,
          Schema,
          Segments
        >;
        await applySideEffects(fullArgs, sideEffects);
        return response;
      } catch (error) {
        if (isSerializedAPIError(error)) {
          throw error;
        }
        throw makeCommonError("requestError", error).toJSON();
      }
    };

    return transform(partializedFetcher, segments);
  };
}
