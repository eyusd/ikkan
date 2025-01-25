import {
  IkkanHandlerParams,
  isSerializedAPIError,
  JsonValue,
  makeCommonError,
  makeFetcherSearchParams,
  NextHTTPMethod,
  SerializedAPIError,
} from "@ikkan/core";
import { z } from "zod";
import { WaterfallFunction } from "../types";
import { useState } from "react";
import useSWR from "swr";
import { makeOperator } from "../utils";
import { IkkanClientBridgeWithStateHook } from "./types";

export function ikkanClientBridgeSearchParamsWithState<
  Endpoint extends string,
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType | undefined = undefined,
  Mut extends [string, unknown][] = []
>(
  { method }: IkkanHandlerParams<Method, Output, Schema>,
  waterfall: {
    [K in keyof Mut]: WaterfallFunction<Mut[K][0], Output, Mut[K][1]>;
  }
): IkkanClientBridgeWithStateHook<Endpoint, Output, Schema> {
  const fetcher = makeFetcherSearchParams<Endpoint, Method, Output, Schema>(
    method
  );

  return (
    url: Endpoint | null,
    params: Schema extends undefined
      ? undefined
      : z.infer<Exclude<Schema, undefined>>,
    options?: RequestInit
  ) => {
    const operator = makeOperator<Endpoint, Output, Schema, Mut>(
      url ?? "" as unknown as Endpoint,
      fetcher,
      waterfall,
    );
    const partialOperator = () => operator(params, options);

    const [error, setError] = useState<SerializedAPIError | undefined>(
      undefined
    );
    const { data } = useSWR<Output, unknown>(url, partialOperator, {
      onError: (error) => {
        const serializedError = isSerializedAPIError(error)
          ? error
          : makeCommonError("requestError", error).toJSON();
        setError(serializedError);
      },
    });

    return { data, error };
  };
}
