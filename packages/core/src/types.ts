import { NextRequest } from "next/server";
import { z } from "zod";
import { NextDynamicSegments, NextHTTPMethod } from "./next";

type JsonObj = { [key: string]: JsonVal };
type JsonVal = null | boolean | number | string | JsonVal[] | JsonObj;
export type JsonValue = Exclude<JsonVal, undefined>;

export type EndpointGenerator<
  EndpointArgs extends Record<string, string | string[]> | undefined,
> =
  EndpointArgs extends Record<string, string | string[]>
    ? (args: EndpointArgs) => string
    : () => string;

/**
 * Configuration type for Ikkan endpoints.
 *
 * @template Method - The HTTP method type (e.g., GET, POST).
 * @template Output - The expected output type of the endpoint.
 * @template Schema - The Zod schema type for request validation, if any.
 * @template EndpointArgs - The type of endpoint arguments, if any.
 * @template ServerSideImports - The type of server-side imports, if any.
 *
 * @property {Method} method - The HTTP method for the endpoint.
 * @property {EndpointGenerator<EndpointArgs>} endpoint - The function to generate the endpoint URL.
 * @property {Schema} [schema] - The Zod schema for request validation, if applicable.
 * @property {ServerSideImports} [ssi] - The function to import server-side dependencies, if applicable.
 * @property {Function} fn - The handler function for the endpoint. The signature of this function varies based on the presence of `Schema`, `EndpointArgs`, and `ServerSideImports`.
 */
export type IkkanConfig<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType | undefined,
  EndpointArgs extends Record<string, string | string[]> | undefined,
  ServerSideImports extends (() => Promise<any>) | undefined,
> = {
  method: Method;
  endpoint: EndpointGenerator<EndpointArgs>;
} & (Schema extends z.ZodType ? { schema: Schema } : {}) &
  (ServerSideImports extends () => Promise<any>
    ? { ssi: ServerSideImports }
    : {}) & {
    fn: EndpointArgs extends Record<string, string | string[]>
      ? Schema extends z.ZodType
        ? ServerSideImports extends () => Promise<any>
          ? (
              req: NextRequest,
              params: z.infer<Schema>,
              segments: NextDynamicSegments<EndpointArgs>,
              imports: Awaited<ReturnType<ServerSideImports>>,
            ) => Promise<Output>
          : (
              req: NextRequest,
              params: z.infer<Schema>,
              segments: NextDynamicSegments<EndpointArgs>,
            ) => Promise<Output>
        : ServerSideImports extends () => Promise<any>
          ? (
              req: NextRequest,
              segments: NextDynamicSegments<EndpointArgs>,
              imports: Awaited<ReturnType<ServerSideImports>>,
            ) => Promise<Output>
          : (
              req: NextRequest,
              segments: NextDynamicSegments<EndpointArgs>,
            ) => Promise<Output>
      : Schema extends z.ZodType
        ? ServerSideImports extends () => Promise<any>
          ? (
              req: NextRequest,
              params: z.infer<Schema>,
              imports: Awaited<ReturnType<ServerSideImports>>,
            ) => Promise<Output>
          : (req: NextRequest, params: z.infer<Schema>) => Promise<Output>
        : ServerSideImports extends () => Promise<any>
          ? (
              req: NextRequest,
              imports: Awaited<ReturnType<ServerSideImports>>,
            ) => Promise<Output>
          : (req: NextRequest) => Promise<Output>;
  };
