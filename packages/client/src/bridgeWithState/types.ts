import { FetcherParams, JsonValue, SerializedAPIError } from "@ikkan/core";
import { z } from "zod";

export type IkkanClientBridgeWithStateHook<
  EndpointGenerator extends (...args: unknown[]) => string,
  Output extends JsonValue,
  Schema extends z.ZodType | undefined = undefined,
> = (...args: FetcherParams<EndpointGenerator, Schema>) => {
  data: Output | undefined;
  error: SerializedAPIError | undefined;
};
