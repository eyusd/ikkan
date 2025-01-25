import { NextRequest, NextResponse } from "next/server";
import { SerializedAPIError } from "./errors";

export type NextHTTPMethodWithBody = "POST" | "PUT" | "PATCH";
export type NextHTTPMethodWithSearchParams =
  // No support for HEAD
  "GET" | "DELETE" | "OPTIONS";
export type NextHTTPMethod =
  | NextHTTPMethodWithBody
  | NextHTTPMethodWithSearchParams;

const METHODS_BODY_PARAMS = ["POST", "PUT", "PATCH"];
const METHODS_SEARCH_PARAMS = ["GET", "DELETE", "HEAD", "OPTIONS"];

export function methodHandler<HandlerType>(
  method: NextHTTPMethod,
  handlers: {
    body: HandlerType;
    search: HandlerType;
  },
) {
  if (METHODS_BODY_PARAMS.includes(method)) {
    return handlers.body;
  }

  if (METHODS_SEARCH_PARAMS.includes(method)) {
    return handlers.search;
  }

  throw new Error(`Invalid method: ${method}`);
}

export interface NextRouteContext {
  params?: Promise<{ [key: string]: string | string[] }>;
}
export type NextHandler<Output> = (
  req: NextRequest,
  context?: NextRouteContext,
) => Promise<NextResponse<Output | SerializedAPIError>>;
