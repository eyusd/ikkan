import {
  Fetcher,
  JsonValue,
  makeCommonError,
  NextHTTPMethod,
} from "@ikkan/core";
import { z } from "zod";
import { WaterfallFunction } from "./types";
import { mutate } from "swr";

export type Operator<
  Output extends JsonValue,
  Schema extends z.ZodType | undefined = undefined,
> = (
  params: Schema extends undefined
    ? undefined
    : z.infer<Exclude<Schema, undefined>>,
  options?: RequestInit,
) => Promise<Output>;

export function makeOperator<
  Endpoint extends string,
  Output extends JsonValue,
  Schema extends z.ZodType | undefined = undefined,
  Mut extends [string, unknown][] = [],
>(
  url: Endpoint,
  fetcher: Fetcher<Endpoint, Output, Schema>,
  waterfall: {
    [K in keyof Mut]: WaterfallFunction<Mut[K][0], Output, Mut[K][1]>;
  },
): Operator<Output, Schema> {
  return async (
    params: Schema extends undefined
      ? undefined
      : z.infer<Exclude<Schema, undefined>>,
    options?: RequestInit,
  ) => {
    try {
      const response = await fetcher(url, params, options);

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
