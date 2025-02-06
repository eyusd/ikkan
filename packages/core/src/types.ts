import { NextRequest } from "next/server";
import { z } from "zod";
import { NextDynamicSegments, NextHTTPMethod, NextRouteContext } from "./next";

type JsonObj = { [key: string]: JsonVal };
type JsonVal = null | boolean | number | string | JsonVal[] | JsonObj;
export type JsonValue = Exclude<JsonVal, undefined>;

export type EndpointGenerator<
  EndpointArgs extends Record<string, string | string[]> | undefined,
> =
  EndpointArgs extends Record<string, string | string[]>
    ? (args: EndpointArgs) => string
    : () => string;

type IkkanFunctionNoSchemaNoContext<Output extends JsonValue> = (
  req: NextRequest,
) => Promise<Output>;

type IkkanFunctionNoSchemaWithContext<
  Output extends JsonValue,
  EndpointArgs extends Record<string, string | string[]>,
> = (
  req: NextRequest,
  context: NextDynamicSegments<EndpointArgs>,
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
  segments: NextDynamicSegments<EndpointArgs>,
) => Promise<Output>;

export type IkkanConfig<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType | undefined,
  EndpointArgs extends Record<string, string | string[]> | undefined,
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
