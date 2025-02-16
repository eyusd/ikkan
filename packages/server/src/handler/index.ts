import { z } from "zod";
import {
  ikkanHandlerSearchParamsNoSSI,
  ikkanHandlerSearchParamsWithSSI,
} from "./handlerSearchParams";
import {
  ikkanHandlerBodyParamsNoSSI,
  ikkanHandlerBodyParamsWithSSI,
} from "./handlerBodyParams";
import {
  ikkanHandlerNoSchemaNoSSI,
  ikkanHandlerNoSchemaWithSSI,
} from "./handlerNoSchema";
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
  [key in Uppercase<Method>]: NextHandler<Output>;
};

/**
 * Turns an Ikkan configuration object into a proper Next API route handler.
 *
 * @template Method - The HTTP method type.
 * @template Output - The type of the output JSON value.
 * @template Schema - The Zod schema type or undefined.
 * @template Segments - The type of endpoint arguments or undefined.
 * @template SSI - The type of server-side imports or undefined.
 *
 * @param {IkkanConfig<Method, Output, Schema, Segments, SSI>} config - The configuration object for the Ikkan handler.
 * @returns {Promise<IkkanHandlerExport<Method, Output>>} - A promise that resolves to the Ikkan handler export.
 *
 * @throws {Error} If the method is invalid.
 */
export async function ikkanHandler<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType | undefined,
  Segments extends Record<string, string | string[]> | undefined,
  SSI extends (() => Promise<any>) | undefined,
>(
  config: IkkanConfig<Method, Output, Schema, Segments, SSI>,
): Promise<IkkanHandlerExport<Method, Output>> {
  const { method } = config;
  if ("ssi" in config) {
    if ("schema" in config) {
      if (METHODS_BODY_PARAMS.includes(method)) {
        const handler = await ikkanHandlerBodyParamsWithSSI(config as any);
        return { [method.toUpperCase()]: handler } as IkkanHandlerExport<
          Method,
          Output
        >;
      }

      if (METHODS_SEARCH_PARAMS.includes(method)) {
        const handler = await ikkanHandlerSearchParamsWithSSI(config as any);
        return { [method.toUpperCase()]: handler } as IkkanHandlerExport<
          Method,
          Output
        >;
      }

      throw new Error("Invalid method");
    } else {
      const handler = await ikkanHandlerNoSchemaWithSSI(config as any);
      return { [method.toUpperCase()]: handler } as IkkanHandlerExport<
        Method,
        Output
      >;
    }
  } else {
    if ("schema" in config) {
      if (METHODS_BODY_PARAMS.includes(method)) {
        const handler = await ikkanHandlerBodyParamsNoSSI(config as any);
        return { [method.toUpperCase()]: handler } as IkkanHandlerExport<
          Method,
          Output
        >;
      }

      if (METHODS_SEARCH_PARAMS.includes(method)) {
        const handler = await ikkanHandlerSearchParamsNoSSI(config as any);
        return { [method.toUpperCase()]: handler } as IkkanHandlerExport<
          Method,
          Output
        >;
      }

      throw new Error("Invalid method");
    } else {
      const handler = await ikkanHandlerNoSchemaNoSSI(config as any);
      return { [method.toUpperCase()]: handler } as IkkanHandlerExport<
        Method,
        Output
      >;
    }
  }
}
