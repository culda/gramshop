import {
  APIGatewayProxyHandlerV2,
  APIGatewayProxyHandlerV2WithLambdaAuthorizer,
} from "aws-lambda";
import { lambdaWrapper } from "../../lambdaWrapper";
import { checkNull, ddb } from "../../utils";
import { GetItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import { Table } from "sst/node/table";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { AuthorizerContext } from "@/functions/jwtAuthorizer/handler";

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

    return {
      statusCode: 200,
      body: JSON.stringify(Item),
    };
  });
