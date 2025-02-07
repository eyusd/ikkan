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

export function makeCommonError(
  type: "invalidParams" | "requestError" | "internalServerError",
  data: unknown,
) {
  switch (type) {
    case "invalidParams":
      return new APIError("Invalid parameters", 400, data);
    case "requestError":
      return new APIError("Request error", 400, data);
    case "internalServerError":
      return new APIError("Internal server error", 500, data);
  }
}
