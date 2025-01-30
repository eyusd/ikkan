import { z } from "zod";
import { NextHTTPMethod } from "../next";
import { JsonValue } from "../types";
import { isSerializedAPIError, makeCommonError } from "../errors";
import { Fetcher } from "./types";

const fetcher = <T>(
  method: NextHTTPMethod,
  url: string,
  params: T,
  options?: RequestInit,
) =>
  fetch(
    params
      ? `${url}?params=${encodeURIComponent(JSON.stringify(params))}`
      : url,
    {
      method,
      // Options should be overriding, in case of special trickery
      ...options,
    },
  )
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

export function makeFetcherSearchParams<
  EndpointGenerator extends (...args: unknown[]) => string,
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType,
>(
  endpointGenerator: EndpointGenerator,
  method: Method,
): Fetcher<EndpointGenerator, Output, Schema> {
  const argCount = endpointGenerator.length;
  if (argCount === 0) {
    return async function fetcherSearch(
      ...args: [
        params: z.infer<Exclude<Schema, undefined>>,
        options?: RequestInit,
      ]
    ): Promise<Output> {
      const url = endpointGenerator();
      const [params, options] = args;

      return await fetcher(method, url, params, options);
    } as Fetcher<EndpointGenerator, Output, Schema>;
  } else {
    return async function fetcherSearch(
      ...args: [
        endpointGeneratorArgs: Parameters<EndpointGenerator>,
        params: z.infer<Exclude<Schema, undefined>>,
        options?: RequestInit,
      ]
    ): Promise<Output> {
      const [endpointGeneratorArgs, params, options] = args;
      const url = endpointGenerator(...endpointGeneratorArgs);

      return await fetcher(method, url, params, options);
    } as Fetcher<EndpointGenerator, Output, Schema>;
  }
}
