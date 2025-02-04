import { NextHTTPMethod } from "../next";
import { EndpointGenerator, JsonValue } from "../types";
import { isSerializedAPIError, makeCommonError } from "../errors";
import { Fetcher } from "./types";
import { completeRelativeUrl } from "./utils";

const fetcher = <Output extends JsonValue>(
  method: NextHTTPMethod,
  url: string,
  options?: RequestInit,
): Promise<Output> =>
  fetch(completeRelativeUrl(url), {
    method,
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

export function makeFetcherNoSchemaNoEndpoint<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends undefined,
  EndpointArgs extends undefined,
>(
  endpointGenerator: EndpointGenerator<EndpointArgs>,
  method: Method,
): Fetcher<Output, Schema, EndpointArgs> {
  return async function fetcherNoSchema(
    ...args: [options?: RequestInit]
  ): Promise<Output> {
    const url = endpointGenerator();
    const [options] = args;

    return await fetcher<Output>(method, url, options);
  } as Fetcher<Output, Schema, EndpointArgs>;
}

export function makeFetcherNoSchemaWithEndpoint<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends undefined,
  EndpointArgs extends Record<string, string | string[]>,
>(
  endpointGenerator: EndpointGenerator<EndpointArgs>,
  method: Method,
): Fetcher<Output, Schema, EndpointArgs> {
  return async function fetcherNoSchema(
    ...args: [endpointGeneratorArgs: EndpointArgs, options?: RequestInit]
  ): Promise<Output> {
    const [endpointGeneratorArgs, options] = args;
    const url = endpointGenerator(endpointGeneratorArgs);

    return await fetcher<Output>(method, url, options);
  } as Fetcher<Output, Schema, EndpointArgs>;
}
