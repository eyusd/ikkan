"use client";

import { APIError, isSerializedAPIError, SerializedAPIError } from "@ikkan/core";
import { useState } from "react";
import useSWR, { mutate } from "swr";

export function makeSWRGetHook<
  Endpoint extends string,
  ReturnType,
  GetParams,
>() {
  return (
    url: Endpoint | null,
    getParams: GetParams,
    options?: RequestInit,
  ) => {
    const fetcher = async (url: Endpoint): Promise<ReturnType> =>
      fetch(
        getParams
          ? `${url}?params=${encodeURIComponent(JSON.stringify(getParams))}`
          : url,
        {
          method: "GET",
          // Options should be overriding, in case of special trickery
          ...options,
        },
      ).then(async (res) => {
        const result = await res.json();
        if (isSerializedAPIError(result)) {
          throw result;
        }
        return result;
      });

    const [error, setError] = useState<SerializedAPIError | undefined>(
      undefined,
    );
    const { data } = useSWR<ReturnType, unknown>(url, fetcher, {
      onError: (error) => {
        const serializedError = isSerializedAPIError(error)
          ? error
          : new APIError("Error fetching data", undefined, { error }).toJSON();
        setError(serializedError);
      },
    });

    return { data, error };
  };
}

type WaterfallFunction<E extends string, R, T> = (returnValue: R) => {
  endpoint: E;
  mutator: (arg: T | undefined) => T | undefined;
};

export function makeSWRPostHook<
  Endpoint extends string,
  ReturnType,
  PostParams,
  Mut extends [string, any][],
>(waterfall: {
  [K in keyof Mut]: WaterfallFunction<Mut[K][0], ReturnType, Mut[K][1]>;
}) {
  const fetcher = async (
    url: Endpoint,
    postParams: PostParams,
    options?: RequestInit,
  ): Promise<ReturnType> =>
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postParams),
      // Options should be overriding, in case of special trickery
      ...options,
    }).then(async (res) => {
      const result = await res.json();
      if (isSerializedAPIError(result)) {
        throw result;
      }
      return result;
    });

  // Create the proper hook
  return (url: Endpoint) => {
    const post = async (postParams: PostParams, options?: RequestInit) => {
      try {
        const response = await fetcher(url, postParams, options);

        // iterate over the waterfall
        await Promise.all(
          waterfall.map(async (waterfallFunction) => {
            const { endpoint, mutator } = waterfallFunction(response);
            return await mutate(endpoint, mutator, {
              populateCache: true,
              revalidate: false,
              rollbackOnError: true,
            });
          }),
        );

        return response;
      } catch (error) {
        const serializedError = isSerializedAPIError(error)
          ? error
          : new APIError("Error fetching data", undefined, { error }).toJSON();
        throw serializedError;
      }
    };

    return { post };
  };
}

export function makeExoticSWRPostHook<Endpoint extends string, PostParams>() {
  const fetcher = async (
    url: Endpoint,
    postParams: PostParams,
    options?: RequestInit,
  ): Promise<ArrayBuffer> =>
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postParams),
      // Options should be overriding, in case of special trickery
      ...options,
    }).then(async (res) => {
      if (!res.ok) {
        const result = await res.json();
        if (isSerializedAPIError(result)) {
          throw result;
        }
        throw new APIError("Internal server error", 500).toJSON();
      }
      const arrayBuffer = await res.arrayBuffer();
      return arrayBuffer;
    });

  // Create the proper hook
  return (url: Endpoint) => {
    const post = async (postParams: PostParams, options?: RequestInit) => {
      try {
        const response = await fetcher(url, postParams, options);
        return response;
      } catch (error) {
        const serializedError = isSerializedAPIError(error)
          ? error
          : new APIError("Error fetching data", undefined, { error }).toJSON();
        throw serializedError;
      }
    };

    return { post };
  };
}
