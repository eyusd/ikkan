import { z } from "zod";
import { NextHTTPMethod } from "../next";
import { JsonValue } from "../types";
import { isSerializedAPIError, makeCommonError } from "../errors";
import { Fetcher } from "./types";

export function makeFetcherBodyParams<
  Endpoint extends string,
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType | undefined = undefined,
>(method: Method): Fetcher<Endpoint, Output, Schema> {
  return async (
    url: Endpoint,
    params: Schema extends undefined
      ? undefined
      : z.infer<Exclude<Schema, undefined>>,
    options?: RequestInit,
  ): Promise<Output> =>
    fetch(url, {
      method,
      body: JSON.stringify(params),
      // Options should be overriding, in case of special trickery
      ...options,
    })
      .then(async (res) => {
        const result = await res.json();
        if (isSerializedAPIError(result)) {
          throw result;
        }
        return result;
      })
      .catch((error) => {
        throw makeCommonError("requestError", error).toJSON();
      });
}
