import { z } from "zod";
import { NextHTTPMethod } from "../next";
import { EndpointGenerator, JsonValue } from "../types";
import { isSerializedAPIError, makeCommonError } from "../errors";
import { IkkanFetcher, IkkanFetcherParams } from "./types";
import { completeRelativeUrl } from "./utils";

const fetcher = <T>(
  method: NextHTTPMethod,
  url: string,
  params: T,
  options?: RequestInit,
) =>
  fetch(
    completeRelativeUrl(
      params
        ? `${url}?params=${encodeURIComponent(JSON.stringify(params))}`
        : url,
    ),
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

export function makeFetcherSearchParamsNoEndpoint<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType,
>(
  endpointGenerator: EndpointGenerator<undefined>,
  method: Method,
): IkkanFetcher<Output, Schema, undefined> {
  return async function fetcherSearch(
    ...args: IkkanFetcherParams<Schema, undefined>
  ): Promise<Output> {
    const url = endpointGenerator();
    const [params, options] = args;

    return await fetcher(method, url, params, options);
  } as IkkanFetcher<Output, Schema, undefined>;
}

export function makeFetcherSearchParamsWithEndpoint<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType,
  EndpointArgs extends Record<string, string | string[]>,
>(
  endpointGenerator: EndpointGenerator<EndpointArgs>,
  method: Method,
): IkkanFetcher<Output, Schema, EndpointArgs> {
  return async function fetcherSearch(
    ...args: IkkanFetcherParams<Schema, EndpointArgs>
  ): Promise<Output> {
    const [endpointGeneratorArgs, params, options] = args;
    const url = endpointGenerator(endpointGeneratorArgs);

    return await fetcher(method, url, params, options);
  } as IkkanFetcher<Output, Schema, EndpointArgs>;
}
