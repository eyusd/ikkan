export type SerializedAPIError = { message: string; data?: unknown };

// For the API
export class APIError extends Error {
  constructor(
    public message: string,
    public status: number = 500,
    public data?: unknown,
  ) {
    super(message);
    this.name = "APIError";
    this.data = data;
    this.status = status;
  }

  toJSON(): SerializedAPIError {
    return {
      message: this.message,
      data: this.data,
    };
  }
}

// For the consumers of the API
export type NoAPIError<T> = T extends SerializedAPIError ? never : T;
export const isSerializedAPIError = (
  something: unknown,
): something is SerializedAPIError => {
  return (
    typeof something === "object" &&
    something !== null &&
    "message" in something &&
    typeof (something as SerializedAPIError).message === "string"
  );
};

const COMMON_ERRORS = {
  invalidParams: new APIError("Invalid parameters", 400),
  requestError: new APIError("Request error", 400),
  internalServerError: new APIError("Internal server error", 500),
};
export function makeCommonError(
  type: keyof typeof COMMON_ERRORS,
  data: unknown,
) {
  const error = COMMON_ERRORS[type];
  error.data = data;
  return error;
}
