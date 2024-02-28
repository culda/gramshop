import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { lambdaWrapper } from "../../lambdaWrapper";
import { ApiResponse, checkNull, ddb } from "../../utils";
import { QueryCommand } from "@aws-sdk/client-dynamodb";
import { Table } from "sst/node/table";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { Shop } from "@/model";

export const handler: APIGatewayProxyHandlerV2 = async (event) =>
  lambdaWrapper(event, async () => {
    console.log(event.queryStringParameters);
    const id = checkNull(event?.queryStringParameters?.id, 400);

    const { Items } = await ddb.send(
      new QueryCommand({
        TableName: Table.ShopsTable.tableName,
        IndexName: "PublicIndex",
        KeyConditionExpression: "id = :id",
        ExpressionAttributeValues: marshall({ ":id": id }),
        ProjectionExpression: "products, currency",
      })
    );

    if (!Items || Items.length === 0) {
      return ApiResponse({
        status: 404,
        body: { message: "Shop not found" },
      });
    }

    const shop = unmarshall(Items[0]) as Pick<Shop, "products">;
    return ApiResponse({
      body: shop,
    });
  });
