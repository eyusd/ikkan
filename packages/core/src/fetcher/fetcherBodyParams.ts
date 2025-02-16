import { z } from "zod";
import { NextHTTPMethod } from "../next";
import { EndpointGenerator, JsonValue } from "../types";
import { isSerializedAPIError, makeCommonError } from "../errors";
import { IkkanFetcher, IkkanFetcherParams } from "./types";
import { completeRelativeUrl } from "./utils";

const fetcher = <T, Output extends JsonValue>(
  method: NextHTTPMethod,
  url: string,
  params: T,
  options?: RequestInit,
): Promise<Output> =>
  fetch(completeRelativeUrl(url), {
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
      if (isSerializedAPIError(error)) {
        throw error;
      }
      throw makeCommonError("requestError", error).toJSON();
    });

export function makeFetcherBodyParamsNoEndpoint<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType,
>(
  endpointGenerator: EndpointGenerator<undefined>,
  method: Method,
): IkkanFetcher<Output, Schema, undefined> {
  return async function fetcherBody(
    ...args: IkkanFetcherParams<Schema, undefined>
  ): Promise<Output> {
    const url = endpointGenerator();
    const [params, options] = args;

    return await fetcher<z.infer<Schema>, Output>(method, url, params, options);
  } as IkkanFetcher<Output, Schema, undefined>;
}

export function makeFetcherBodyParamsWithEndpoint<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType,
  Segments extends Record<string, string | string[]>,
>(
  endpointGenerator: EndpointGenerator<Segments>,
  method: Method,
): IkkanFetcher<Output, Schema, Segments> {
  return async function fetcherBody(
    ...args: IkkanFetcherParams<Schema, Segments>
  ): Promise<Output> {
    const [segments, params, options] = args;
    const url = endpointGenerator(segments);

    return await fetcher(method, url, params, options);
  } as IkkanFetcher<Output, Schema, Segments>;
}
