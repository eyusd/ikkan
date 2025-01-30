import { z } from "zod";
import { NextHTTPMethod } from "../next";
import { JsonValue } from "../types";
import { isSerializedAPIError, makeCommonError } from "../errors";
import {
  Fetcher,
  FetcherParamsEmptyEndpoint,
  FetcherParamsNonEmptyEndpoint,
} from "./types";

const fetcher = <T>(
  method: NextHTTPMethod,
  url: string,
  params: T,
  options?: RequestInit,
) =>
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

export function makeFetcherBodyParams<
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
    return async function fetcherBody(
      ...args: FetcherParamsEmptyEndpoint<Schema>
    ): Promise<Output> {
      const url = endpointGenerator();
      const [params, options] = args;

      return await fetcher(method, url, params, options);
    } as Fetcher<EndpointGenerator, Output, Schema>;
  } else {
    return async function fetcherBody(
      ...args: FetcherParamsNonEmptyEndpoint<EndpointGenerator, Schema>
    ): Promise<Output> {
      const [endpointGeneratorArgs, params, options] = args;
      const url = endpointGenerator(...endpointGeneratorArgs);

      return await fetcher(method, url, params, options);
    } as Fetcher<EndpointGenerator, Output, Schema>;
  }
}
