import { NextRequest, NextResponse } from "next/server";

export type SerializedAPIError = { message: string; status: number, data?: Object };

// For the API
export class APIError extends Error {
  constructor(
    public message: string,
    public status: number = 500,
    public data?: any
  ) {
    super(message);
    this.name = "APIError";
    this.data = data;
    this.status = status;
  }

  toJSON(): SerializedAPIError {
    return {
      message: this.message,
      status: this.status,
      data: this.data,
    };
  }
}


// For the consumers of the API
export type NoAPIError<T> = T extends SerializedAPIError ? never : T;
export const isSerializedAPIError = (
  something: any,
): something is SerializedAPIError => something && something.message && something.status;


function handleError(error: unknown): NextResponse {
  if (error instanceof APIError) {
    return NextResponse.json(error.toJSON(), { status: error.status });
  }
  if (error instanceof Error) {
    return NextResponse.json(new APIError(error.message).toJSON(), {
      status: 500,
    });
  }

  const defaultError: SerializedAPIError = {
    message: "An unexpected error occurred",
    status: 500,
    data: { error },
  };
  return NextResponse.json(defaultError, {
    status: 500,
  });
}


// Bridge
type Handler<Args extends any[], ReturnType> = (
  req: NextRequest,
  ...operationParameters: Args
) => Promise<ReturnType>;


export async function APIErrorWrapper<Args extends any[], ReturnType>(
  operation: Handler<Args, ReturnType>,
  req: NextRequest,
  ...parameters: Args
): Promise<NextResponse> {
  try {
    return NextResponse.json(await operation(req, ...parameters), {
      status: 200,
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function ExoticAPIErrorWrapper<
  Args extends any[],
  ReturnType extends ArrayBuffer,
>(
  operation: Handler<Args, ReturnType>,
  req: NextRequest,
  ...parameters: Args
): Promise<NextResponse> {
  try {
    return new NextResponse(await operation(req, ...parameters), {
      status: 200,
    });
  } catch (error) {
    return handleError(error);
  }
}
