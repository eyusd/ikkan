import { z } from "zod";
import { ikkanHandlerSearchParams } from "./handlerSearchParams";
import { ikkanHandlerBodyParams } from "./handlerBodyParams";
import {
  IkkanHandlerParams,
  IkkanMethodHandlerParams,
  JsonValue,
  NextHTTPMethod,
  NextHandler,
  methodHandler,
} from "@ikkan/core";

type IkkanHandlerExport<
  Method extends NextHTTPMethod,
  Output extends JsonValue
> = Record<Method, NextHandler<Output>>;

export function ikkanHandler<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType | undefined = undefined
>(
  params: IkkanHandlerParams<Method, Output, Schema>
): IkkanHandlerExport<Method, Output> {
  const { method, ...rest } = params;

  const handler = methodHandler(method, {
    body: ikkanHandlerBodyParams(
      rest as unknown as IkkanMethodHandlerParams<Output, Schema>
    ),
    search: ikkanHandlerSearchParams(
      rest as unknown as IkkanMethodHandlerParams<Output, Schema>
    ),
  });

  return { [method]: handler } as IkkanHandlerExport<Method, Output>;
}
