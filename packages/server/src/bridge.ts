import { isSerializedAPIError } from "@ikkan/core";

export function makeServerGet<
  Endpoint extends string,
  ReturnType,
  GetParams,
>() {
  const fetcher = async (
    url: Endpoint,
    getParams: GetParams,
    defaultReturn: ReturnType,
    options?: RequestInit,
  ): Promise<ReturnType> =>
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
        return defaultReturn;
      }
      return result;
    });

  return fetcher;
}

export function makeServerPost<
  Endpoint extends string,
  ReturnType,
  PostParams,
>() {
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

  return fetcher;
}
