import { z } from "zod";
import { NextHTTPMethod } from "../next";
import { EndpointGenerator, JsonValue } from "../types";
import { isSerializedAPIError, makeCommonError } from "../errors";
import { Fetcher, FetcherParams } from "./types";
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
      throw makeCommonError("requestError", error).toJSON();
    });

export function makeFetcherBodyParamsNoEndpoint<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType,
  EndpointArgs extends undefined,
>(
  endpointGenerator: EndpointGenerator<EndpointArgs>,
  method: Method,
): Fetcher<Output, Schema, EndpointArgs> {
  return async function fetcherBody(
    ...args: FetcherParams<Schema, EndpointArgs>
  ): Promise<Output> {
    const url = endpointGenerator();
    const [params, options] = args;

    return await fetcher<z.infer<Schema>, Output>(method, url, params, options);
  } as Fetcher<Output, Schema, EndpointArgs>;
}

export function makeFetcherBodyParamsWithEndpoint<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType,
  EndpointArgs extends Record<string, string | string[]>,
>(
  endpointGenerator: EndpointGenerator<EndpointArgs>,
  method: Method,
): Fetcher<Output, Schema, EndpointArgs> {
  return async function fetcherBody(
    ...args: FetcherParams<Schema, EndpointArgs>
  ): Promise<Output> {
    const [endpointGeneratorArgs, params, options] = args;
    const url = endpointGenerator(endpointGeneratorArgs);

    return await fetcher(method, url, params, options);
  } as Fetcher<Output, Schema, EndpointArgs>;
}
