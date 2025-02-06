import { IkkanFetcher, JsonValue, NextHTTPMethod } from "@ikkan/core";
import { z } from "zod";

export function makeTransform<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType | undefined,
>(method: Method) {
  return (partializedFetcher: IkkanFetcher<Output, Schema, undefined>) =>
    ({
      [method]: partializedFetcher,
    }) as { [key in Method]: IkkanFetcher<Output, Schema, undefined> };
}
