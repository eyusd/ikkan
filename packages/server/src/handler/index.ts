import { z } from "zod";
import { ikkanHandlerSearchParams } from "./handlerSearchParams";
import { ikkanHandlerBodyParams } from "./handlerBodyParams";
import {
  JsonValue,
  NextHTTPMethod,
  NextHandler,
  branchHandler,
} from "@ikkan/core";
import { IkkanConfig } from "@ikkan/core";
import { ikkanHandlerNoSchema } from "./handlerNoSchema";

type IkkanHandlerExport<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
> = {
  [key in Uppercase<Method>]: NextHandler<Output>
}

export function ikkanHandler<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType | undefined = undefined,
  EndpointArgs extends
    | Record<string, string | string[]>
    | undefined = undefined,
>(
  config: IkkanConfig<Method, Output, Schema, EndpointArgs>,
): IkkanHandlerExport<Method, Output> {
  const { method } = config;
  const handler = branchHandler(config, [], {
    noSchemaNoEndpoint: ikkanHandlerNoSchema,
    noSchemaWithEndpoint: ikkanHandlerNoSchema,
    bodyParamsNoEndpoint: ikkanHandlerBodyParams,
    bodyParamsWithEndpoint: ikkanHandlerBodyParams,
    searchParamsNoEndpoint: ikkanHandlerSearchParams,
    searchParamsWithEndpoint: ikkanHandlerSearchParams,
  });

  return { [method.toUpperCase()]: handler } as IkkanHandlerExport<Method, Output>;
}
