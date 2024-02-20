import { APIGatewayProxyHandlerV2WithLambdaAuthorizer } from "aws-lambda";
import { lambdaWrapper } from "../../lambdaWrapper";
import { ApiResponse, checkNull, ddb } from "../../utils";
import { GetItemCommand } from "@aws-sdk/client-dynamodb";
import { Table } from "sst/node/table";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { AuthorizerContext } from "@/functions/jwtAuthorizer/handler";
import { Shop } from "@/model";

export const handler: APIGatewayProxyHandlerV2WithLambdaAuthorizer<
  AuthorizerContext
> = async (event) =>
  lambdaWrapper(event, async () => {
    const userId = checkNull(
      event.requestContext.authorizer.lambda.userId,
      400
    );
    const id = checkNull(event?.pathParameters?.id, 400);

    const { Item } = await ddb.send(
      new GetItemCommand({
        TableName: Table.ShopsTable.tableName,
        Key: marshall({ id, userId }),
      })
    );

    if (!Item) {
      return ApiResponse({
        status: 404,
        message: "Shop not found",
      });
    }

    return ApiResponse({
      body: unmarshall(Item) as Shop,
    });
  });
