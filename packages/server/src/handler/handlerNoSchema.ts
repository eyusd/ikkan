import { NextResponse } from "next/server";
import { handleError } from "@/handler/utils";
import {
  IkkanConfig,
  JsonValue,
  NextHandler,
  NextHTTPMethod,
} from "@ikkan/core";

export function ikkanHandlerNoSchema<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  EndpointArgs extends Record<string, string | string[]> | undefined,
>(
  config: IkkanConfig<Method, Output, undefined, EndpointArgs>,
): NextHandler<Output> {
  const { fn } = config;
  return async (req, { params: context }) => {
    try {
      const segments = await context;
      return NextResponse.json(await fn(req, segments), { status: 200 });
    } catch (error) {
      return handleError(error);
    }
  };
}
