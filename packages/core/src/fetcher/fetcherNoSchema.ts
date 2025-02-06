import { NextHTTPMethod } from "../next";
import { EndpointGenerator, JsonValue } from "../types";
import { isSerializedAPIError, makeCommonError } from "../errors";
import { IkkanFetcher, IkkanFetcherParams } from "./types";
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
>(
  endpointGenerator: EndpointGenerator<undefined>,
  method: Method,
): IkkanFetcher<Output, undefined, undefined> {
  return async function fetcherNoSchema(
    ...args: IkkanFetcherParams<undefined, undefined>
  ): Promise<Output> {
    const url = endpointGenerator();
    const [options] = args;

    return await fetcher<Output>(method, url, options);
  } as IkkanFetcher<Output, undefined, undefined>;
}

export function makeFetcherNoSchemaWithEndpoint<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  EndpointArgs extends Record<string, string | string[]>,
>(
  endpointGenerator: EndpointGenerator<EndpointArgs>,
  method: Method,
): IkkanFetcher<Output, undefined, EndpointArgs> {
  return async function fetcherNoSchema(
    ...args: IkkanFetcherParams<undefined, EndpointArgs>
  ): Promise<Output> {
    const [endpointGeneratorArgs, options] = args;
    const url = endpointGenerator(endpointGeneratorArgs);

    return await fetcher<Output>(method, url, options);
  } as IkkanFetcher<Output, undefined, EndpointArgs>;
}
