import { APIGatewayProxyHandlerV2WithLambdaAuthorizer } from "aws-lambda";
import { lambdaWrapper } from "../../lambdaWrapper";
import { ApiResponse, checkNull, ddb } from "../../utils";
import { QueryCommand } from "@aws-sdk/client-dynamodb";
import { Table } from "sst/node/table";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { AuthorizerContext } from "@/functions/jwtAuthorizer/handler";

export const handler: APIGatewayProxyHandlerV2WithLambdaAuthorizer<
  AuthorizerContext
> = async (event) =>
  lambdaWrapper(event, async () => {
    const id = checkNull(event.requestContext.authorizer.lambda.userId, 400);

    const { Items } = await ddb.send(
      new QueryCommand({
        TableName: Table.ShopsTable.tableName,
        IndexName: "UserIdIndex",
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: marshall({ ":userId": id }),
      })
    );

    return ApiResponse({
      body: Items,
    });
  });
