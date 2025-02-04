import { z } from "zod";
import { ikkanHandlerSearchParams } from "./handlerSearchParams";
import { ikkanHandlerBodyParams } from "./handlerBodyParams";
import {
  JsonValue,
  NextHTTPMethod,
  NextHandler,
  branchHandler,
} from "@ikkan/core";
import { IkkanHandlerParams } from "@ikkan/core";
import { ikkanHandlerNoSchema } from "./handlerNoSchema";

type IkkanHandlerExport<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
> = Record<Method, NextHandler<Output>>;

export function ikkanHandler<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType | undefined = undefined,
  EndpointArgs extends
    | Record<string, string | string[]>
    | undefined = undefined,
>(
  params: IkkanHandlerParams<Method, Output, Schema, EndpointArgs>,
): IkkanHandlerExport<Method, Output> {
  const handler = branchHandler(params, [], {
    noSchemaNoEndpoint: ikkanHandlerNoSchema,
    noSchemaWithEndpoint: ikkanHandlerNoSchema,
    bodyParamsNoEndpoint: ikkanHandlerBodyParams,
    bodyParamsWithEndpoint: ikkanHandlerBodyParams,
    searchParamsNoEndpoint: ikkanHandlerSearchParams,
    searchParamsWithEndpoint: ikkanHandlerSearchParams,
  });

  return { [params.method]: handler } as IkkanHandlerExport<Method, Output>;
}
