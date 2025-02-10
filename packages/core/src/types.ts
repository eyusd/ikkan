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
              imports: Awaited<ReturnType<ServerSideImports>>
            ) => Promise<Output>
          : (
              req: NextRequest,
              params: z.infer<Schema>,
              segments: NextDynamicSegments<EndpointArgs>
            ) => Promise<Output>
        : ServerSideImports extends () => Promise<any>
          ? (
              req: NextRequest,
              segments: NextDynamicSegments<EndpointArgs>,
              imports: Awaited<ReturnType<ServerSideImports>>
            ) => Promise<Output>
          : (
              req: NextRequest,
              segments: NextDynamicSegments<EndpointArgs>
            ) => Promise<Output>
      : Schema extends z.ZodType
        ? ServerSideImports extends () => Promise<any>
          ? (
              req: NextRequest,
              params: z.infer<Schema>,
              imports: Awaited<ReturnType<ServerSideImports>>
            ) => Promise<Output>
          : (req: NextRequest, params: z.infer<Schema>) => Promise<Output>
        : ServerSideImports extends () => Promise<any>
          ? (
              req: NextRequest,
              imports: Awaited<ReturnType<ServerSideImports>>
            ) => Promise<Output>
          : (req: NextRequest) => Promise<Output>;
  };
