import { NextResponse } from "next/server";
import { handleError } from "@/handler/utils";
import {
  IkkanConfig,
  JsonValue,
  NextHandler,
  NextHTTPMethod,
} from "@ikkan/core";

export async function ikkanHandlerNoSchemaNoSSI<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Segments extends Record<string, string | string[]> | undefined,
  SSI extends undefined,
>(
  config: IkkanConfig<
    Method,
    Output,
    undefined,
    Segments,
    SSI
  >,
): Promise<NextHandler<Output>> {
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

export async function ikkanHandlerNoSchemaWithSSI<
  Method extends NextHTTPMethod,
  Output extends JsonValue,
  Segments extends Record<string, string | string[]> | undefined,
  SSI extends () => Promise<any>,
>(
  config: IkkanConfig<
    Method,
    Output,
    undefined,
    Segments,
    SSI
  >,
): Promise<NextHandler<Output>> {
  const { fn, ssi } = config;
  const imports = await ssi();
  return async (req, { params: context }) => {
    try {
      const segments = await context;
      return NextResponse.json(await fn(req, segments, imports), {
        status: 200,
      });
    } catch (error) {
      return handleError(error);
    }
  };
}
