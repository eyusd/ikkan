import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { handleError } from "@/handler/utils";
import {
  IkkanConfig,
  JsonValue,
  makeCommonError,
  NextHandler,
  NextHTTPMethod,
} from "@ikkan/core";

async function parseSearchGuard<T extends z.ZodType>(
  req: NextRequest,
  schema: T,
): Promise<z.infer<T>> {
  try {
    const url = new URL(req.url);
    const params = JSON.parse(url.searchParams.get("params") ?? "{}");
    return schema.parse(params);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw makeCommonError("invalidParams", error.issues);
    }
    throw makeCommonError("invalidParams", error);
  }
}

export async function ikkanHandlerSearchParamsNoSSI<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType,
  Segments extends Record<string, string | string[]> | undefined,
  SSI extends undefined,
>(
  config: IkkanConfig<Method, Output, Schema, Segments, SSI>,
): Promise<NextHandler<Output>> {
  const { schema, fn } = config;
  return async (req, { params: context }) => {
    try {
      const params = await parseSearchGuard(req, schema);
      const segments = await context;
      return NextResponse.json(await fn({req, params, segments}), {
        status: 200,
      });
    } catch (error) {
      return handleError(error);
    }
  };
}

export async function ikkanHandlerSearchParamsWithSSI<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType,
  Segments extends Record<string, string | string[]> | undefined,
  SSI extends () => Promise<any>,
>(
  config: IkkanConfig<Method, Output, Schema, Segments, SSI>,
): Promise<NextHandler<Output>> {
  const { schema, fn, ssi } = config;
  const imports = await ssi();
  return async (req, { params: context }) => {
    try {
      const params = await parseSearchGuard(req, schema);
      const segments = await context;
      return NextResponse.json(await fn({req, params, segments, imports}), {
        status: 200,
      });
    } catch (error) {
      return handleError(error);
    }
  };
}
