import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { lambdaWrapper } from "../../lambdaWrapper";
import { checkNull, ddb } from "../../utils";
import { GetItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
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
        IndexName: "UserIdIndex",
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: marshall({ ":userId": id }),
      })
    );

    console.log(Items);

    // const shops = unmarshall(checkNull(Items, 404)) as Shop[];
    // const res = checkNull(Items, 404);

    return {
      statusCode: 200,
      body: JSON.stringify(Items),
    };
  });
