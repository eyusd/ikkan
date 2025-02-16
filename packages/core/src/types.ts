import { NextRequest } from "next/server";
import { z } from "zod";
import { NextDynamicSegments, NextHTTPMethod } from "./next";

type JsonObj = { [key: string]: JsonVal };
type JsonVal = null | boolean | number | string | JsonVal[] | JsonObj;
export type JsonValue = Exclude<JsonVal, undefined>;

export type EndpointGenerator<
  Segments extends Record<string, string | string[]> | undefined,
> =
  Segments extends Record<string, string | string[]>
    ? (segments: Segments) => string
    : () => string;

/**
 * Configuration type for Ikkan endpoints.
 *
 * @template Method - The HTTP method type (e.g., GET, POST).
 * @template Output - The expected output type of the endpoint.
 * @template Schema - The Zod schema type for request validation, if any.
 * @template Segments - The type of endpoint arguments, if any.
 * @template SSI - The type of server-side imports, if any.
 *
 * @property {Method} method - The HTTP method for the endpoint.
 * @property {EndpointGenerator<Segments>} endpoint - The function to generate the endpoint URL.
 * @property {Schema} [schema] - The Zod schema for request validation, if applicable.
 * @property {SSI} [ssi] - The function to import server-side dependencies, if applicable.
 * @property {Function} fn - The handler function for the endpoint. The signature of this function varies based on the presence of `Schema`, `Segments`, and `SSI`.
 */
export type IkkanConfig<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType | undefined,
  Segments extends Record<string, string | string[]> | undefined,
  SSI extends (() => Promise<any>) | undefined,
> = {
  method: Method;
  endpoint: EndpointGenerator<Segments>;
} & (Schema extends z.ZodType ? { schema: Schema } : {}) &
  (SSI extends () => Promise<any>
    ? { ssi: SSI }
    : {}) & {
    fn: Segments extends Record<string, string | string[]>
      ? Schema extends z.ZodType
        ? SSI extends () => Promise<any>
          ? (
              req: NextRequest,
              params: z.infer<Schema>,
              segments: NextDynamicSegments<Segments>,
              imports: Awaited<ReturnType<SSI>>,
            ) => Promise<Output>
          : (
              req: NextRequest,
              params: z.infer<Schema>,
              segments: NextDynamicSegments<Segments>,
            ) => Promise<Output>
        : SSI extends () => Promise<any>
          ? (
              req: NextRequest,
              segments: NextDynamicSegments<Segments>,
              imports: Awaited<ReturnType<SSI>>,
            ) => Promise<Output>
          : (
              req: NextRequest,
              segments: NextDynamicSegments<Segments>,
            ) => Promise<Output>
      : Schema extends z.ZodType
        ? SSI extends () => Promise<any>
          ? (
              req: NextRequest,
              params: z.infer<Schema>,
              imports: Awaited<ReturnType<SSI>>,
            ) => Promise<Output>
          : (req: NextRequest, params: z.infer<Schema>) => Promise<Output>
        : SSI extends () => Promise<any>
          ? (
              req: NextRequest,
              imports: Awaited<ReturnType<SSI>>,
            ) => Promise<Output>
          : (req: NextRequest) => Promise<Output>;
  };
