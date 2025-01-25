import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { handleError, zodKeys } from "@/handler/utils";
import {
  IkkanMethodHandlerParams,
  JsonValue,
  makeCommonError,
  NextHandler,
} from "@ikkan/core";

export async function parseParamsGuard<T extends z.ZodType>(
  req: NextRequest,
  schema: T
): Promise<z.infer<T>> {
  try {
    const url = new URL(req.url);
    const keys = zodKeys(schema);
    const params = JSON.parse(url.searchParams.get("params") ?? "{}");
    return schema.parse(
      Object.fromEntries(keys.map((key) => [key, params[key] ?? null]))
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw makeCommonError("invalidParams", error.issues);
    }
    throw makeCommonError("invalidParams", error);
  }
}

export function ikkanHandlerSearchParams<
  Output extends JsonValue | void = void,
  Schema extends z.ZodType | undefined = undefined
>(
  params: IkkanMethodHandlerParams<Output, Schema>
): NextHandler<Output> {
  if ("schema" in params) {
    const { schema, fn } = params;
    return async (req, context) => {
      try {
        const params = await parseParamsGuard(req, schema);
        return NextResponse.json(await fn(req, params, context), {
          status: 200,
        });
      } catch (error) {
        return handleError(error);
      }
    };
  }
  return async (req, context) => {
    const { fn } = params;
    try {
      return NextResponse.json(await fn(req, context), { status: 200 });
    } catch (error) {
      return handleError(error);
    }
  };
}
