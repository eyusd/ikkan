import {
  IkkanHandlerParams,
  JsonValue,
  methodHandler,
  NextHTTPMethod,
} from "@ikkan/core";
import { z } from "zod";
import { ikkanServerBridgeBodyParams } from "./bridgeBodyParams";
import { ikkanServerBridgeSearchParams } from "./bridgeSearchParams";
import { IkkanServerBridgeHandler } from "./types";

export function ikkanServerBridge<
  Endpoint extends (...args: unknown[]) => string,
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType | undefined = undefined,
>(
  params: IkkanHandlerParams<Endpoint, Method, Output, Schema>,
): IkkanServerBridgeHandler<Endpoint, Output, Schema> {
  const { method } = params;

  return methodHandler(method, {
    body: ikkanServerBridgeBodyParams(params),
    search: ikkanServerBridgeSearchParams(params),
  }) as IkkanServerBridgeHandler<Endpoint, Output, Schema>;
}
