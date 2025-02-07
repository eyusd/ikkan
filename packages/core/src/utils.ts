import { z } from "zod";
import { NextHTTPMethod } from "./next";
import { IkkanConfig, JsonValue } from "./types";

type HandlerOperator<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType | undefined,
  EndpointArgs extends Record<string, string | string[]> | undefined,
> = (
  config: IkkanConfig<Method, Output, Schema, EndpointArgs>,
  ...supplementaryArgs: any[]
) => unknown;

type BranchHandlerParams<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType | undefined,
  EndpointArgs extends Record<string, string | string[]> | undefined,
> = {
  noSchemaNoEndpoint: HandlerOperator<Method, Output, undefined, undefined>;
  noSchemaWithEndpoint: HandlerOperator<
    Method,
    Output,
    undefined,
    Exclude<EndpointArgs, undefined>
  >;
  bodyParamsNoEndpoint: HandlerOperator<
    Method,
    Output,
    Exclude<Schema, undefined>,
    undefined
  >;
  bodyParamsWithEndpoint: HandlerOperator<
    Method,
    Output,
    Exclude<Schema, undefined>,
    Exclude<EndpointArgs, undefined>
  >;
  searchParamsNoEndpoint: HandlerOperator<
    Method,
    Output,
    Exclude<Schema, undefined>,
    undefined
  >;
  searchParamsWithEndpoint: HandlerOperator<
    Method,
    Output,
    Exclude<Schema, undefined>,
    Exclude<EndpointArgs, undefined>
  >;
};

const METHODS_BODY_PARAMS = ["POST", "PUT", "PATCH"];
const METHODS_SEARCH_PARAMS = ["GET", "DELETE", "HEAD", "OPTIONS"];

export function branchHandler<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType | undefined,
  EndpointArgs extends Record<string, string | string[]> | undefined,
>(
  config: IkkanConfig<Method, Output, Schema, EndpointArgs>,
  supplementaryArgs: unknown[],
  branches: BranchHandlerParams<Method, Output, Schema, EndpointArgs>,
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
