import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { handleError, zodKeys } from "@/handler/utils";
import {
  IkkanHandlerParams,
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
    const keys = zodKeys(schema);
    const params = JSON.parse(url.searchParams.get("params") ?? "{}");
    return schema.parse(
      Object.fromEntries(keys.map((key) => [key, params[key] ?? null])),
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw makeCommonError("invalidParams", error.issues);
    }
    throw makeCommonError("invalidParams", error);
  }
}

export function ikkanHandlerSearchParams<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends z.ZodType,
  EndpointArgs extends Record<string, string | string[]> | undefined,
>(
  params: IkkanHandlerParams<Method, Output, Schema, EndpointArgs>,
): NextHandler<Output> {
  const { schema, fn } = params;
  return async (req, context) => {
    try {
      const params = await parseSearchGuard(req, schema);
      return NextResponse.json(await fn(req, params, context), {
        status: 200,
      });
    } catch (error) {
      return handleError(error);
    }
  };
}
