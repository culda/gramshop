import AppScene from "@/components/AppScene";
import React from "react";
import { NewScene } from "./NewScene";
import fetchAuth from "@/app/fetchAuth";
import { TempShop } from "@/model";
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { Table } from "sst/node/table";

export type PpParams = {
  searchParams: {
    id?: string;
  };
};

const ddb = new DynamoDBClient({ region: "us-east-1" });

const Page = async ({ searchParams }: PpParams) => {
  /**
   * Check if a temp shop was created on the id
   */
  let ts;
  if (searchParams.id) {
    const { Item } = await ddb.send(
      new GetItemCommand({
        TableName: Table.TempShopTable.tableName,
        Key: marshall({ id: searchParams.id }),
      })
    );
    if (Item) {
      ts = unmarshall(Item) as TempShop;
    }
  }
  return (
    <AppScene title={"New Shop"}>
      <NewScene ts={ts} />
    </AppScene>
  );
};

export default Page;
