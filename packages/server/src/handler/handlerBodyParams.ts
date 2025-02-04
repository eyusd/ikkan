import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { handleError } from "@/handler/utils";
import {
  IkkanHandlerParams,
  JsonValue,
  makeCommonError,
  NextHandler,
  NextHTTPMethod,
} from "@ikkan/core";

async function parseBodyGuard<T extends z.ZodType>(
  req: NextRequest,
  schema: T,
): Promise<z.infer<T>> {
  try {
    return schema.parse(await req.json());
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw makeCommonError("invalidParams", error.issues);
    }
    throw makeCommonError("invalidParams", error);
  }
}

export function ikkanHandlerBodyParams<
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
      const params = await parseBodyGuard(req, schema);
      return NextResponse.json(await fn(req, params, context), {
        status: 200,
      });
    } catch (error) {
      return handleError(error);
    }
  };
}
