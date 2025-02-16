import { z } from "zod";
import { NextHTTPMethod } from "./next";
import { IkkanConfig, JsonValue } from "./types";

type HandlerOperator<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType | undefined,
  Segments extends Record<string, string | string[]> | undefined,
  SSI extends (() => Promise<any>) | undefined,
> = (
  config: IkkanConfig<Method, Output, Schema, Segments, SSI>,
  ...supplementaryArgs: any[]
) => unknown;

type SchemaEndpointBranchParams<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType | undefined,
  Segments extends Record<string, string | string[]> | undefined,
  SSI extends (() => Promise<any>) | undefined,
> = {
  noSchemaNoEndpoint: HandlerOperator<
    Method,
    Output,
    undefined,
    undefined,
    SSI
  >;
  noSchemaWithEndpoint: HandlerOperator<
    Method,
    Output,
    undefined,
    Exclude<Segments, undefined>,
    SSI
  >;
  bodyParamsNoEndpoint: HandlerOperator<
    Method,
    Output,
    Exclude<Schema, undefined>,
    undefined,
    SSI
  >;
  bodyParamsWithEndpoint: HandlerOperator<
    Method,
    Output,
    Exclude<Schema, undefined>,
    Exclude<Segments, undefined>,
    SSI
  >;
  searchParamsNoEndpoint: HandlerOperator<
    Method,
    Output,
    Exclude<Schema, undefined>,
    undefined,
    SSI
  >;
  searchParamsWithEndpoint: HandlerOperator<
    Method,
    Output,
    Exclude<Schema, undefined>,
    Exclude<Segments, undefined>,
    SSI
  >;
};

export const METHODS_BODY_PARAMS = ["POST", "PUT", "PATCH"];
export const METHODS_SEARCH_PARAMS = ["GET", "DELETE", "HEAD", "OPTIONS"];

export function schemaEndpointBranch<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType | undefined,
  Segments extends Record<string, string | string[]> | undefined,
  SSI extends (() => Promise<any>) | undefined,
>(
  config: IkkanConfig<Method, Output, Schema, Segments, SSI>,
  supplementaryArgs: unknown[],
  branches: SchemaEndpointBranchParams<
    Method,
    Output,
    Schema,
    Segments,
    SSI
  >,
) {
  const { endpoint, method } = config;

  if ("schema" in config) {
    if (METHODS_BODY_PARAMS.includes(method)) {
      switch (endpoint.length) {
        case 0: {
          return branches.bodyParamsNoEndpoint(
            // @ts-expect-error
            config,
            ...supplementaryArgs,
          );
        }
        case 1: {
          return branches.bodyParamsWithEndpoint(
            // @ts-expect-error
            config,
            ...supplementaryArgs,
          );
        }
        default: {
          throw new Error("Invalid endpoint");
        }
      }
    }

    if (METHODS_SEARCH_PARAMS.includes(method)) {
      switch (endpoint.length) {
        case 0: {
          return branches.searchParamsNoEndpoint(
            // @ts-expect-error
            config,
            ...supplementaryArgs,
          );
        }
        case 1: {
          return branches.searchParamsWithEndpoint(
            // @ts-expect-error
            config,
            ...supplementaryArgs,
          );
        }
        default: {
          throw new Error("Invalid endpoint");
        }
      }
    }

    throw new Error("Invalid method");
  }

  switch (endpoint.length) {
    case 0: {
      return branches.noSchemaNoEndpoint(
        // @ts-expect-error
        config,
        ...supplementaryArgs,
      );
    }
    case 1: {
      return branches.noSchemaWithEndpoint(
        // @ts-expect-error
        config,
        ...supplementaryArgs,
      );
    }
    default: {
      throw new Error("Invalid endpoint");
    }
  }
}
