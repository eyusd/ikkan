import { NextRequest } from "next/server";
import { z } from "zod";
import { NextHTTPMethod, NextRouteContext } from "./next";

type JsonObj = { [key: string]: JsonVal };
type JsonVal = null | boolean | number | string | JsonVal[] | JsonObj;
export type JsonValue = Exclude<JsonVal, undefined>;

export type EndpointGenerator<
  EndpointArgs extends Record<string, string | string[]> | undefined,
> = EndpointArgs extends Record<string, string | string[]>
  ? (args: EndpointArgs) => string
  : () => string


// export type HandlerFunctionWithSchema<Output, Schema extends z.ZodType> = (
//   req: NextRequest,
//   params: z.infer<Schema>,
//   context?: NextRouteContext,
// ) => Promise<Output>;

// export type HandlerFunctionWithoutSchema<Output> = (
//   req: NextRequest,
//   context?: NextRouteContext,
// ) => Promise<Output>;

// type IkkanMethodHandlerParamsWithoutSchema<Output> = {
//   fn: HandlerFunctionWithoutSchema<Output>;
// };
// type IkkanMethodHandlerParamsWithSchema<Output, Schema extends z.ZodType> = {
//   schema: Schema;
//   fn: HandlerFunctionWithSchema<Output, Schema>;
// };
// export type IkkanMethodHandlerParams<
//   Output = unknown,
//   Schema extends z.ZodType | undefined = undefined,
// > = Schema extends z.ZodType
//   ? IkkanMethodHandlerParamsWithSchema<Output, Exclude<Schema, undefined>>
//   : IkkanMethodHandlerParamsWithoutSchema<Output>;
// export type IkkanServerHandlerParams<
//   Method extends NextHTTPMethod,
//   Output extends JsonValue,
//   Schema extends z.ZodType | undefined = undefined,
// > = {
//   method: Method;
// } & IkkanMethodHandlerParams<Output, Schema>;
// export type IkkanHandlerParams<
//   EndpointGenerator extends (...args: unknown[]) => string,
//   Method extends NextHTTPMethod,
//   Output extends JsonValue,
//   Schema extends z.ZodType | undefined = undefined,
// > = {
//   endpoint: EndpointGenerator;
// } & IkkanServerHandlerParams<Method, Output, Schema>;

type IkkanFunctionNoSchemaNoContext<Output extends JsonValue> = (
  req: NextRequest,
) => Promise<Output>;

type IkkanFunctionNoSchemaWithContext<
  Output extends JsonValue,
  EndpointArgs extends Record<string, string | string[]>,
> = (
  req: NextRequest,
  context: NextRouteContext<EndpointArgs>,
) => Promise<Output>;

type IkkanFunctionWithSchemaNoContext<
  Output extends JsonValue,
  Schema extends z.ZodType,
> = (req: NextRequest, params: z.infer<Schema>) => Promise<Output>;

type IkkanFunctionWithSchemaWithContext<
  Output extends JsonValue,
  Schema extends z.ZodType,
  EndpointArgs extends Record<string, string | string[]>,
> = (
  req: NextRequest,
  params: z.infer<Schema>,
  context: NextRouteContext<EndpointArgs>,
) => Promise<Output>;

export type IkkanHandlerParams<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType | undefined,
  EndpointArgs extends
    | Record<string, string | string[]>
    | undefined,
> = {
  method: Method;
  endpoint: EndpointGenerator<EndpointArgs>;
} & (Schema extends z.ZodType
  ? { schema: Schema } // If Schema is undefined, schema is omitted
  : {}) & {
    // Otherwise, schema is required
    fn: EndpointArgs extends Record<string, string | string[]>
      ? Schema extends z.ZodType
        ? IkkanFunctionWithSchemaWithContext<Output, Schema, EndpointArgs>
        : IkkanFunctionNoSchemaWithContext<Output, EndpointArgs>
      : Schema extends z.ZodType
        ? IkkanFunctionWithSchemaNoContext<Output, Schema>
        : IkkanFunctionNoSchemaNoContext<Output>;
  };
