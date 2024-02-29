import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyResultV2 } from "aws-lambda";

export const ddb = new DynamoDBClient({ region: "us-east-1" });

type ApiResponseParams = {
  status?: number;
  body?: any;
  message?: string;
};

// The ApiResponse function
export function ApiResponse({
  status = 200,
  body,
  message,
}: ApiResponseParams): APIGatewayProxyResultV2 {
  if (status >= 400) {
    // Handle error responses
    return {
      statusCode: status,
      body: JSON.stringify({ message: message || "An error occurred" }),
    };
  } else {
    // Handle successful responses
    return {
      statusCode: status,
      body: JSON.stringify(body || {}),
    };
  }
}

export function checkNull<T>(
  value: T | null | undefined,
  statusCode: number
): T {
  if (value === null || value === undefined) {
    throw new Error(
      JSON.stringify({
        statusCode,
        message: "Value is null",
      })
    );
  }
  return value as T;
}

export function checkTrue<T>(value: unknown, statusCode: number): T {
  if (value !== true) {
    throw new Error(
      JSON.stringify({
        statusCode,
        message: "Value is null",
      })
    );
  }
  return value as T;
}

export function checkPermission(jwtUserId: string, requestUserId: string) {
  if (requestUserId !== jwtUserId) {
    throw new Error(
      JSON.stringify({
        statusCode: 403,
        message: "Not authorized",
      })
    );
  }
}
