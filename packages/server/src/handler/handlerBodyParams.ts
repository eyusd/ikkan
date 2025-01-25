import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { handleError } from "@/handler/utils";
import {
  IkkanMethodHandlerParams,
  JsonValue,
  makeCommonError,
  NextHandler,
} from "@ikkan/core";

export async function parseBodyGuard<T extends z.ZodType>(
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
  Output extends JsonValue | void = void,
  Schema extends z.ZodType | undefined = undefined,
>(params: IkkanMethodHandlerParams<Output, Schema>): NextHandler<Output> {
  if ("schema" in params) {
    const { schema, fn } = params;
    return async (req, context) => {
      try {
        const params = await parseBodyGuard(req, schema);
        return NextResponse.json<Output>(await fn(req, params, context), {
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
