import { z } from "zod";
import { NextHTTPMethod } from "./next";
import { IkkanHandlerParams, JsonValue } from "./types";

type HandlerOperator<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType | undefined,
  EndpointArgs extends Record<string, string | string[]> | undefined,
  SuppArgs
> = (
  params: IkkanHandlerParams<Method, Output, Schema, EndpointArgs>,
  ...supplementaryArgs: SuppArgs[]
) => unknown;

type BranchHandlerParams<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType | undefined,
  EndpointArgs extends Record<string, string | string[]> | undefined,
  SuppArgs
> = {
  noSchemaNoEndpoint: HandlerOperator<Method, Output, undefined, undefined, SuppArgs>;
  noSchemaWithEndpoint: HandlerOperator<
    Method,
    Output,
    undefined,
    Exclude<EndpointArgs, undefined>,
    SuppArgs
  >;
  bodyParamsNoEndpoint: HandlerOperator<
    Method,
    Output,
    Exclude<Schema, undefined>,
    undefined,
    SuppArgs
  >;
  bodyParamsWithEndpoint: HandlerOperator<
    Method,
    Output,
    Exclude<Schema, undefined>,
    Exclude<EndpointArgs, undefined>,
    SuppArgs
  >;
  searchParamsNoEndpoint: HandlerOperator<
    Method,
    Output,
    Exclude<Schema, undefined>,
    undefined,
    SuppArgs
  >;
  searchParamsWithEndpoint: HandlerOperator<
    Method,
    Output,
    Exclude<Schema, undefined>,
    Exclude<EndpointArgs, undefined>,
    SuppArgs
  >;
};

const METHODS_BODY_PARAMS = ["POST", "PUT", "PATCH"];
const METHODS_SEARCH_PARAMS = ["GET", "DELETE", "HEAD", "OPTIONS"];

export function branchHandler<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType | undefined,
  EndpointArgs extends Record<string, string | string[]> | undefined,
  SuppArgs
>(
  params: IkkanHandlerParams<Method, Output, Schema, EndpointArgs>,
  supplementaryArgs: SuppArgs[],
  branches: BranchHandlerParams<
    Method,
    Output,
    Schema,
    EndpointArgs,
    SuppArgs
  >
) {
  const { endpoint, method } = params;

  if ("schema" in params) {
    if (METHODS_BODY_PARAMS.includes(method)) {
      if (endpoint.length === 0) {
        return branches.bodyParamsNoEndpoint(
          params as unknown as IkkanHandlerParams<
            Method,
            Output,
            Exclude<Schema, undefined>,
            undefined
          >,
          ...supplementaryArgs
        );
      }
      if (endpoint.length === 1) {
        return branches.bodyParamsWithEndpoint(
          params as unknown as IkkanHandlerParams<
            Method,
            Output,
            Exclude<Schema, undefined>,
            Exclude<EndpointArgs, undefined>
          >,
          ...supplementaryArgs
        );
      }
      throw new Error("Invalid endpoint");
    }

    if (METHODS_SEARCH_PARAMS.includes(method)) {
      if (endpoint.length === 0) {
        return branches.searchParamsNoEndpoint(
          params as unknown as IkkanHandlerParams<
            Method,
            Output,
            Exclude<Schema, undefined>,
            undefined
          >,
          ...supplementaryArgs
        );
      }
      if (endpoint.length === 1) {
        return branches.searchParamsWithEndpoint(
          params as unknown as IkkanHandlerParams<
            Method,
            Output,
            Exclude<Schema, undefined>,
            Exclude<EndpointArgs, undefined>
          >,
          ...supplementaryArgs
        );
      }
      throw new Error("Invalid endpoint");
    }

    throw new Error("Invalid method");
  }

  if (endpoint.length === 0) {
    return branches.noSchemaNoEndpoint(
      params as unknown as IkkanHandlerParams<
        Method,
        Output,
        undefined,
        undefined
      >,
      ...supplementaryArgs
    );
  }
  if (endpoint.length === 1) {
    return branches.noSchemaWithEndpoint(
      params as unknown as IkkanHandlerParams<
        Method,
        Output,
        undefined,
        Exclude<EndpointArgs, undefined>
      >,
      ...supplementaryArgs
    );
  }
  throw new Error("Invalid endpoint");
}
