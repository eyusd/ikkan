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
  EndpointArgs extends Record<string, string | string[]> | undefined,
  T extends JsonValue[],
>(
  fullArgs: FullArgs<Output, Schema, EndpointArgs>,
  sideEffects: IkkanSideEffects<T, Output, Schema, EndpointArgs>,
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
          args: undefined,
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
  EndpointArgs extends Record<string, string | string[]>,
  T extends JsonValue[],
  TransformResult,
>(
  fetcher: IkkanFetcher<Output, Schema, EndpointArgs>,
  sideEffects: IkkanSideEffects<T, Output, Schema, EndpointArgs>,
  transform: (
    partializedFetcher: IkkanFetcher<Output, Schema, undefined>,
    args: EndpointArgs,
  ) => TransformResult,
) {
  return (args: EndpointArgs) => {
    const partializedFetcher: IkkanFetcher<Output, Schema, undefined> = async (
      ...params: IkkanFetcherParams<Schema, undefined>
    ): Promise<Output> => {
      try {
        const response = await fetcher(...([args, ...params] as any));
        const fullArgs = { output: response, params, args } as FullArgs<
          Output,
          Schema,
          EndpointArgs
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

    return transform(partializedFetcher, args);
  };
}
