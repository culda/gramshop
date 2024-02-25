import { Product, Shop } from "@/model";
import { APIGatewayProxyHandlerV2WithLambdaAuthorizer } from "aws-lambda";
import { ApiResponse, checkNull, ddb } from "../../utils";
import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { Table } from "sst/node/table";
import { lambdaWrapper } from "../../lambdaWrapper";
import { marshall } from "@aws-sdk/util-dynamodb";
import { AuthorizerContext } from "@/functions/jwtAuthorizer/handler";
import { nanoid } from "nanoid";

export type PutShopRequest = {
  id: string;
  name: string;
  products: Product[];
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
    const id = nanoid(10);

    const shopRequest = JSON.parse(event.body as string) as PutShopRequest;
    const shop: Shop = {
      id,
      name: shopRequest.name,
      userId,
      products: shopRequest.products,
    };

    console.log(shop);

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
