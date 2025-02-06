import { NextResponse } from "next/server";
import { APIError, makeCommonError, SerializedAPIError } from "@ikkan/core";

export function handleError(error: unknown): NextResponse<SerializedAPIError> {
  if (error instanceof APIError) {
    return NextResponse.json(error.toJSON(), { status: error.status });
  } else if (error instanceof Error) {
    return NextResponse.json(new APIError(error.message).toJSON(), {
      status: 500,
    });
  } else if (typeof error === "object" && error && "message" in error) {
    const { message, data } = error as SerializedAPIError;
    return NextResponse.json({ message, data }, { status: 500 });
  } else if (typeof error === "string") {
    return NextResponse.json(new APIError(error).toJSON(), { status: 500 });
  } else {
    return NextResponse.json(makeCommonError("internalServerError", error), {
      status: 500,
    });
  }
}
