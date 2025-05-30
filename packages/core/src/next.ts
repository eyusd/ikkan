import { NextRequest, NextResponse } from "next/server";
import { SerializedAPIError } from "./errors";

export type NextHTTPMethodWithBody = "POST" | "PUT" | "PATCH";
export type NextHTTPMethodWithSearchParams =
  // No support for HEAD
  "GET" | "DELETE" | "OPTIONS";
export type NextHTTPMethod =
  | NextHTTPMethodWithBody
  | NextHTTPMethodWithSearchParams;

export type NextDynamicSegments<T extends Record<string, string | string[]>> =
  T;
export type NextRouteContext<T extends Record<string, string | string[]>> = {
  params: Promise<NextDynamicSegments<T>>;
};
export type NextHandler<Output> = (
  req: NextRequest,
  context: NextRouteContext<Record<string, string | string[]>>,
) => Promise<NextResponse<Output | SerializedAPIError>>;
