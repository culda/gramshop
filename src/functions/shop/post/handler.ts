import { Shop } from "@/model";
import { APIGatewayProxyHandlerV2WithLambdaAuthorizer } from "aws-lambda";
import { ApiResponse, checkNull, ddb } from "../../utils";
import { AttributeValue, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { Table } from "sst/node/table";
import { lambdaWrapper } from "../../lambdaWrapper";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { AuthorizerContext } from "@/functions/jwtAuthorizer/handler";

export type PostShopRequest = Partial<Shop> & {
  id: string;
};

export const handler: APIGatewayProxyHandlerV2WithLambdaAuthorizer<
  AuthorizerContext
> = async (event) =>
  lambdaWrapper(event, async () => {
    console.log(event.body);
    const userId = checkNull(
      event.requestContext.authorizer.lambda.userId,
      400
    );

    const req = JSON.parse(event.body as string) as PostShopRequest;

    await ddbUpdateShop({
      id: req.id,
      userId,
      providerToken: req.providerToken,
      name: req.name,
    });

    return ApiResponse({
      status: 200,
    });
  });

export async function ddbUpdateShop({
  id,
  userId,
  providerToken,
  name,
}: PostShopRequest): Promise<Shop> {
  const expressionAttributeValues: Record<string, AttributeValue> = {};

  let updateExpression = "SET";

  if (providerToken) {
    expressionAttributeValues[":providerToken"] = { S: providerToken };
    updateExpression += " providerToken = :providerToken,";
  }

  if (name) {
    expressionAttributeValues[":name"] = { S: name };
    updateExpression += " name = :name,";
  }

  updateExpression = updateExpression.slice(0, -1); // Remove the trailing comma

  const { Attributes } = await ddb.send(
    new UpdateItemCommand({
      TableName: Table.ShopsTable.tableName,
      Key: marshall({ id, userId }, { removeUndefinedValues: true }),
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
    })
  );

  if (!Attributes) throw new Error("Shop not found");

  return unmarshall(Attributes) as Shop;
}
