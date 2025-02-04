import { NextResponse } from "next/server";
import { handleError } from "@/handler/utils";
import {
  IkkanHandlerParams,
  JsonValue,
  NextHandler,
  NextHTTPMethod,
} from "@ikkan/core";

export function ikkanHandlerNoSchema<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Schema extends undefined,
  EndpointArgs extends Record<string, string | string[]> | undefined,
>(
  params: IkkanHandlerParams<Method, Output, Schema, EndpointArgs>,
): NextHandler<Output> {
  const { fn } = params;
  return async (req, context) => {
    try {
      return NextResponse.json(await fn(req, context), { status: 200 });
    } catch (error) {
      return handleError(error);
    }
  };
}
