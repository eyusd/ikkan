import { NextHTTPMethod } from "../next";
import { JsonValue } from "../types";
import { isSerializedAPIError, makeCommonError } from "../errors";
import { Fetcher } from "./types";

const fetcher = (method: NextHTTPMethod, url: string, options?: RequestInit) =>
  fetch(url, {
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

export function makeFetcherNoSchema<
  EndpointGenerator extends (...args: unknown[]) => string,
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends undefined,
>(
  endpointGenerator: EndpointGenerator,
  method: Method,
): Fetcher<EndpointGenerator, Output, Schema> {
  const argCount = endpointGenerator.length;
  if (argCount === 0) {
    return async function fetcherNoSchema(
      ...args: [options?: RequestInit]
    ): Promise<Output> {
      const url = endpointGenerator();
      const [options] = args;

      return await fetcher(method, url, options);
    } as Fetcher<EndpointGenerator, Output, Schema>;
  } else {
    return async function fetcherNoSchema(
      ...args: [
        endpointGeneratorArgs: Parameters<EndpointGenerator>,
        options?: RequestInit,
      ]
    ): Promise<Output> {
      const [endpointGeneratorArgs, options] = args;
      const url = endpointGenerator(...endpointGeneratorArgs);

      return await fetcher(method, url, options);
    } as Fetcher<EndpointGenerator, Output, Schema>;
  }
}
