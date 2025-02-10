import { z } from "zod";
import { ikkanHandlerSearchParamsNoSSI, ikkanHandlerSearchParamsWithSSI } from "./handlerSearchParams";
import { ikkanHandlerBodyParamsNoSSI, ikkanHandlerBodyParamsWithSSI } from "./handlerBodyParams";
import { ikkanHandlerNoSchemaNoSSI, ikkanHandlerNoSchemaWithSSI } from "./handlerNoSchema";
import {
  JsonValue,
  METHODS_BODY_PARAMS,
  METHODS_SEARCH_PARAMS,
  NextHTTPMethod,
  NextHandler,
} from "@ikkan/core";
import { IkkanConfig } from "@ikkan/core";

type IkkanHandlerExport<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
> = {
  [key in Uppercase<Method>]: NextHandler<Output>
}

export async function ikkanHandler<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType | undefined,
  EndpointArgs extends
    | Record<string, string | string[]>
    | undefined,
  ServerSideImports extends (() => Promise<any>) | undefined,
>(
  config: IkkanConfig<Method, Output, Schema, EndpointArgs, ServerSideImports>,
): Promise<IkkanHandlerExport<Method, Output>> {
  const { method } = config;
  if ("ssi" in config) {
    if ("schema" in config) {
      if (METHODS_BODY_PARAMS.includes(method)) {
        const handler = await ikkanHandlerBodyParamsWithSSI(config as any)
        return { [method.toUpperCase()]: handler } as IkkanHandlerExport<Method, Output>;
      }

      if (METHODS_SEARCH_PARAMS.includes(method)) {
        const handler = await ikkanHandlerSearchParamsWithSSI(config as any)
        return { [method.toUpperCase()]: handler } as IkkanHandlerExport<Method, Output>;
      }

      throw new Error("Invalid method");
    } else {
      const handler = await ikkanHandlerNoSchemaWithSSI(config as any)
      return { [method.toUpperCase()]: handler } as IkkanHandlerExport<Method, Output>;
    }
  } else {
    if ("schema" in config) {
      if (METHODS_BODY_PARAMS.includes(method)) {
        const handler = await ikkanHandlerBodyParamsNoSSI(config as any)
        return { [method.toUpperCase()]: handler } as IkkanHandlerExport<Method, Output>;
      }

      if (METHODS_SEARCH_PARAMS.includes(method)) {
        const handler = await ikkanHandlerSearchParamsNoSSI(config as any)
        return { [method.toUpperCase()]: handler } as IkkanHandlerExport<Method, Output>;
      }

      throw new Error("Invalid method");
    } else {
      const handler = await ikkanHandlerNoSchemaNoSSI(config as any)
      return { [method.toUpperCase()]: handler } as IkkanHandlerExport<Method, Output>;
    }
  }
}
