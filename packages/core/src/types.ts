import { NextRequest } from "next/server";
import { z } from "zod";
import { NextHTTPMethod, NextRouteContext } from "./next";

type JsonObj = { [key: string]: JsonVal };
type JsonVal = null | boolean | number | string | JsonVal[] | JsonObj;
export type JsonValue = Exclude<JsonVal, undefined>;

export type HandlerFunctionWithSchema<Output, Schema extends z.ZodType> = (
  req: NextRequest,
  params: z.infer<Schema>,
  context?: NextRouteContext,
) => Promise<Output>;

export type HandlerFunctionWithoutSchema<Output> = (
  req: NextRequest,
  context?: NextRouteContext,
) => Promise<Output>;

type IkkanMethodHandlerParamsWithoutSchema<Output> = {
  fn: HandlerFunctionWithoutSchema<Output>;
};
type IkkanMethodHandlerParamsWithSchema<Output, Schema extends z.ZodType> = {
  schema: Schema;
  fn: HandlerFunctionWithSchema<Output, Schema>;
};
export type IkkanMethodHandlerParams<
  Output = unknown,
  Schema extends z.ZodType | undefined = undefined,
> = Schema extends z.ZodType
  ? IkkanMethodHandlerParamsWithSchema<Output, Exclude<Schema, undefined>>
  : IkkanMethodHandlerParamsWithoutSchema<Output>;
export type IkkanServerHandlerParams<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType | undefined = undefined,
> = {
  method: Method;
} & IkkanMethodHandlerParams<Output, Schema>;
export type IkkanHandlerParams<
  EndpointGenerator extends (...args: unknown[]) => string,
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType | undefined = undefined,
> = {
  endpoint: EndpointGenerator;
} & IkkanServerHandlerParams<Method, Output, Schema>;
