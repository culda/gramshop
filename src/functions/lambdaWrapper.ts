import { TransactionCanceledException } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { ApiResponse } from "./utils";

export async function lambdaWrapper(
  event: APIGatewayProxyEventV2,
  eventHandler: (
    event: APIGatewayProxyEventV2
  ) => Promise<APIGatewayProxyResultV2>
) {
  try {
    return eventHandler(event);
  } catch (error) {
    console.log("error", error);
    if (error instanceof Error && error.message.startsWith("{")) {
      const errorObject = JSON.parse(error.message);
      return ApiResponse({
        status: errorObject.statusCode || 500,
        message: errorObject.message,
      });
    } else if (
      error instanceof TransactionCanceledException &&
      error?.CancellationReasons
    ) {
      console.log(error.CancellationReasons);
      return ApiResponse({
        status: 500,
      });
    } else {
      return ApiResponse({
        status: 500,
      });
    }
  }
}
