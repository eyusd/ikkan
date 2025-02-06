import {
  ikkanConfig,
  IkkanConfig,
  JsonValue,
  NextHTTPMethod,
} from "@ikkan/core";
import { z } from "zod";
import { IkkanClientBridgeHandler } from "./types";
import { ikkanBridgeWithState } from "./bridgeWithState";
import { ikkanBridgeNoState } from "./bridgeNoState";
import { IkkanSideEffects, sideEffect } from "./sideEffect";

export { sideEffect };

export function ikkanClientBridge<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType | undefined,
  EndpointArgs extends Record<string, string | string[]> | undefined,
  T extends JsonValue[],
>(
  config: IkkanConfig<Method, Output, Schema, EndpointArgs>,
  sideEffects: IkkanSideEffects<T, Output, Schema, EndpointArgs> = [] as any,
): IkkanClientBridgeHandler<Method, Output, Schema, EndpointArgs> {
  const hook = ikkanBridgeWithState(config, sideEffects);
  // @ts-ignore
  const action = ikkanBridgeNoState(config, sideEffects);
  return { hook, action } as IkkanClientBridgeHandler<
    Method,
    Output,
    Schema,
    EndpointArgs
  >;
}

const config = ikkanConfig({
  endpoint: ({ id }: { id: string }) => `/api/${id}`,
  method: "GET",
  schema: z.object({
    name: z.string(),
  }),
  fn: async (_req, { name }, { id }) => {
    return { name: name + id };
  },
});

const client = ikkanClientBridge(config, [
  sideEffect(
    config,
    config,
  )({
    endpointGenerator: ({ args: { id }, params: { name } }) => ({ id }),
    mutator: (cachedValue, response) => ({ name: response.name }),
  }),
]);
