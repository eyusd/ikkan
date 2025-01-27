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
  Output extends JsonValue,
> = Record<Method, NextHandler<Output>>;

/**
 * Handles the creation of an Ikkan handler for a specific HTTP method.
 *
 * @template Method - The HTTP method type (e.g., GET, POST).
 * @template Output - The expected JSON output type.
 * @template Schema - The optional Zod schema type for validation.
 *
 * @param {IkkanHandlerParams<Method, Output, Schema>} params - The parameters for the Ikkan handler.
 * @returns {IkkanHandlerExport<Method, Output>} - An object containing the handler for the specified method.
 */
export function ikkanHandler<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType | undefined = undefined,
>(
  params: IkkanHandlerParams<Method, Output, Schema>,
): IkkanHandlerExport<Method, Output> {
  const { method, ...rest } = params;

  const handler = methodHandler(method, {
    body: ikkanHandlerBodyParams(
      rest as unknown as IkkanMethodHandlerParams<Output, Schema>,
    ),
    search: ikkanHandlerSearchParams(
      rest as unknown as IkkanMethodHandlerParams<Output, Schema>,
    ),
  });

  return { [method]: handler } as IkkanHandlerExport<Method, Output>;
}
