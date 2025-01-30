import {
  FetcherParamsEmptyEndpoint,
  FetcherParamsNonEmptyEndpoint,
  IkkanHandlerParams,
  JsonValue,
  makeFetcherBodyParams,
  NextHTTPMethod,
} from "@ikkan/core";
import { z } from "zod";
import { WaterfallFunction } from "../types";
import { makeWaterfallOperator, WaterfallOperator } from "../utils";
import { IkkanClientBridgeWithStateHook } from "./types";
import { stateWrapper } from "./utils";

export function bridgeBodyParams<
  EndpointGenerator extends (...args: unknown[]) => string,
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType,
  Mut extends [string, unknown][] = [],
>(
  params: IkkanHandlerParams<EndpointGenerator, Method, Output, Schema>,
  waterfall: {
    [K in keyof Mut]: WaterfallFunction<Mut[K][0], Output, Mut[K][1]>;
  },
): IkkanClientBridgeWithStateHook<EndpointGenerator, Output, Schema> {
  const { endpoint, method } = params;
  const fetcher = makeFetcherBodyParams<
    EndpointGenerator,
    Method,
    Output,
    Schema & z.ZodType
  >(endpoint, method);

  if (endpoint.length === 0) {
    return function hook(...args: FetcherParamsEmptyEndpoint<Schema>) {
      const operator = makeWaterfallOperator<
        EndpointGenerator & (() => string),
        Output,
        Schema,
        Mut
      >(
        [] as Parameters<EndpointGenerator & (() => string)>,
        fetcher,
        waterfall,
      );
      const url = endpoint();
      return stateWrapper<Output>(url, () => operator(...args));
    } as IkkanClientBridgeWithStateHook<EndpointGenerator, Output, Schema>;
  } else {
    return function hook(
      ...args: FetcherParamsNonEmptyEndpoint<EndpointGenerator, Schema>
    ) {
      const [fetcherArgs, ...rest] = args;
      const operator = makeWaterfallOperator<
        EndpointGenerator & ((...args: [unknown, ...unknown[]]) => string),
        Output,
        Schema,
        Mut
      >(
        fetcherArgs as Parameters<
          EndpointGenerator & ((...args: [unknown, ...unknown[]]) => string)
        >,
        fetcher,
        waterfall,
      );

      const url = endpoint(...fetcherArgs);

      return stateWrapper<Output>(url, () =>
        operator(...(rest as Parameters<WaterfallOperator<Output, Schema>>)),
      );
    } as IkkanClientBridgeWithStateHook<EndpointGenerator, Output, Schema>;
  }
}
