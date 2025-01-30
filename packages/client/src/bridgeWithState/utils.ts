import {
  isSerializedAPIError,
  JsonValue,
  makeCommonError,
  SerializedAPIError,
} from "@ikkan/core";
import { useState } from "react";
import useSWR from "swr";

export function stateWrapper<Output extends JsonValue>(
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
