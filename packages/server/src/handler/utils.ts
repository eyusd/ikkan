import { NextResponse } from "next/server";
import { APIError, makeCommonError, SerializedAPIError } from "@ikkan/core";
import { z } from "zod";

// get zod object keys recursively
export function zodKeys<T extends z.ZodTypeAny>(schema: T): string[] {
  // make sure schema is not null or undefined
  if (schema === null || schema === undefined) return [];
  // check if schema is nullable or optional
  if (schema instanceof z.ZodNullable || schema instanceof z.ZodOptional)
    return zodKeys(schema.unwrap());
  // check if schema is an array
  if (schema instanceof z.ZodArray) return zodKeys(schema.element);
  // check if schema is an object
  if (schema instanceof z.ZodObject) {
    // get key/value pairs from schema
    const entries = Object.entries(schema.shape);
    // loop through key/value pairs
    return entries.flatMap(([key, value]) => {
      // get nested keys
      const nested =
        value instanceof z.ZodType
          ? zodKeys(value).map((subKey) => `${key}.${subKey}`)
          : [];
      // return nested keys
      return nested.length ? nested : key;
    });
  }
  // return empty array
  return [];
}

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
