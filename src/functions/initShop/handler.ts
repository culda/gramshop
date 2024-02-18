import { Product, Shop } from "@/model";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { randomUUID } from "crypto";
import { ApiResponse, ddb } from "../utils";
import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { Table } from "sst/node/table";
import { lambdaWrapper } from "../lambdaWrapper";
import { marshall } from "@aws-sdk/util-dynamodb";

export type ShopRequestPayload = {
  items: Product[];
};

export const handler: APIGatewayProxyHandlerV2 = async (event) =>
  lambdaWrapper(event, async () => {
    console.log(event.body);
    const id = randomUUID();

    const shopRequest = JSON.parse(event.body as string) as ShopRequestPayload;
    const shop: Shop = {
      id,
      items: shopRequest.items,
    };

    await ddb.send(
      new PutItemCommand({
        TableName: Table.ShopsTable.tableName,
        Item: marshall(shop),
      })
    );

    return ApiResponse({
      status: 200,
      body: shop,
    });
  });
