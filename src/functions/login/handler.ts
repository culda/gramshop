import { User } from "@/model";
import { APIGatewayProxyHandlerV2WithLambdaAuthorizer } from "aws-lambda";
import { ApiResponse, checkNull, ddb } from "../utils";
import { AuthorizerContext } from "@/functions/jwtAuthorizer/handler";
import { lambdaWrapper } from "../lambdaWrapper";
import { GetItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { Table } from "sst/node/table";
import { marshall } from "@aws-sdk/util-dynamodb";

export type LoginRequest = {
  user: User;
};

export const handler: APIGatewayProxyHandlerV2WithLambdaAuthorizer<
  AuthorizerContext
> = async (event) =>
  lambdaWrapper(event, async () => {
    const userId = checkNull(
      event.requestContext.authorizer.lambda.userId,
      400
    );

    const { user } = JSON.parse(event.body as string) as LoginRequest;

    const { Item } = await ddb.send(
      new GetItemCommand({
        TableName: Table.UsersTable.tableName,
        Key: marshall({ id: userId }),
      })
    );

    // If not found create user
    if (!Item) {
      await ddb.send(
        new PutItemCommand({
          TableName: Table.UsersTable.tableName,
          Item: marshall({ ...user, id: userId } as User),
        })
      );
    }

    return ApiResponse({
      status: 200,
    });
  });
