import {
  EndpointGenerator,
  IkkanFetcher,
  IkkanFetcherParams,
  isSerializedAPIError,
  JsonValue,
  makeCommonError,
  SerializedAPIError,
} from "@ikkan/core";
import { useState } from "react";
import useSWR from "swr";
import { z } from "zod";

function stateWrapper<Output extends JsonValue>(
  url: string,
  operator: () => Promise<Output>,
) {
  const [error, setError] = useState<SerializedAPIError | undefined>(undefined);
  const { data } = useSWR<Output, unknown>(url, operator, {
    onError: (error) => {
      const serializedError = isSerializedAPIError(error)
        ? error
        : makeCommonError("requestError", error).toJSON();
      setError(serializedError);
    },
  });

  return { data, error };
}

export function makeTransformNoEndpoint<
  Output extends JsonValue,
  Schema extends z.ZodType | undefined,
>(endpoint: EndpointGenerator<undefined>) {
  return (partializedFetcher: IkkanFetcher<Output, Schema, undefined>) => {
    const url = endpoint();
    return function hook(...params: IkkanFetcherParams<Schema, undefined>) {
      return stateWrapper<Output>(url, () => partializedFetcher(...params));
    };
  };
}

export function makeTransformWithEndpoint<
  Output extends JsonValue,
  Schema extends z.ZodType | undefined,
  EndpointArgs extends Record<string, string | string[]>,
>(endpoint: EndpointGenerator<EndpointArgs>) {
  return (
    partializedFetcher: IkkanFetcher<Output, Schema, undefined>,
    args: EndpointArgs,
  ) => {
    const url = endpoint(args);
    return function hook(...params: IkkanFetcherParams<Schema, undefined>) {
      return stateWrapper<Output>(url, () => partializedFetcher(...params));
    };
  };
}
