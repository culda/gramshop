import { User } from "@/model";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { ApiResponse, checkNull, ddb } from "../utils";
import { lambdaWrapper } from "../lambdaWrapper";
import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { Table } from "sst/node/table";
import { marshall } from "@aws-sdk/util-dynamodb";
import { nanoid } from "nanoid";

export type DemoRequest = {
  url: string;
  email: string;
};

export const handler: APIGatewayProxyHandlerV2 = async (event) =>
  lambdaWrapper(event, async () => {
    console.log(event.body);
    const req = JSON.parse(event.body as string) as DemoRequest;
    const url = checkNull(req.url, 400);
    const email = checkNull(req.email, 400);
    const id = nanoid(10);

    await ddb.send(
      new PutItemCommand({
        TableName: Table.DemosTable.tableName,
        Item: marshall({
          id,
          url,
          email,
          created: new Date().toISOString(),
          status: "pending",
        }),
      })
    );

    return ApiResponse({
      status: 200,
    });
  });
