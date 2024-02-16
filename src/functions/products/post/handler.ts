import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { lambdaWrapper } from "../../lambdaWrapper";
import { checkNull, ddb } from "../../utils";
import { GetItemCommand } from "@aws-sdk/client-dynamodb";
import { Table } from "sst/node/table";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { Shop } from "@/model";

export const handler: APIGatewayProxyHandlerV2 = async (event) =>
  lambdaWrapper(event, async () => {
    console.log(event.queryStringParameters);
    const id = checkNull(event?.queryStringParameters?.shopId, 400);

    const { Item } = await ddb.send(
      new GetItemCommand({
        TableName: Table.ShopsTable.tableName,
        Key: marshall({ id }),
      })
    );

    const shop = unmarshall(checkNull(Item, 404)) as Shop;
    return {
      statusCode: 200,
      body: JSON.stringify(shop.items),
    };
  });
