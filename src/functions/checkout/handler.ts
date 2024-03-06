import { Currency, Invoice, Shop, ShoppingCart, TgUser } from "@/model";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { Telegram } from "puregram";
import { lambdaWrapper } from "../lambdaWrapper";
import { ApiResponse, checkTrue, ddb } from "../utils";
import { PutItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import { Table } from "sst/node/table";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { validateDataFromTelegram } from "./validate";
import { randomUUID } from "crypto";

export type CheckoutRequest = {
  shopId: string;
  cart: ShoppingCart;
  authData: string;
};

export const handler: APIGatewayProxyHandlerV2 = async (event) =>
  lambdaWrapper(event, async () => {
    console.log(event.body);
    const data: CheckoutRequest = JSON.parse(event.body as string);
    const { Items } = await ddb.send(
      new QueryCommand({
        TableName: Table.ShopsTable.tableName,
        IndexName: "PublicIndex",
        KeyConditionExpression: "id = :id",
        ExpressionAttributeValues: marshall({ ":id": data.shopId }),
        ProjectionExpression: "currency, botToken, providerToken",
      })
    );
    if (!Items) {
      return ApiResponse({
        status: 404,
      });
    }

    const shops = Items?.map((item) => unmarshall(item)) as Shop[];
    const shop = shops[0];

    checkTrue(validateDataFromTelegram(data.authData, shop.botToken!), 401);

    const authData = new URLSearchParams(data.authData);
    const user = JSON.parse(authData.get("user") as string) as TgUser;
    const invoiceId = randomUUID();

    await ddb.send(
      new PutItemCommand({
        TableName: Table.InvoicesTable.tableName,
        Item: marshall({
          id: invoiceId,
          shopId: data.shopId,
          userId: user.id.toString(),
          cart: data.cart,
          currency: shop.currency,
          status: "pending",
        } satisfies Invoice),
      })
    );

    await sendInvoiceToChat({
      chatId: user.id,
      cart: data.cart,
      currency: shop.currency,
      botToken: shop.botToken!,
      providerToken: shop.providerToken!,
      invoiceId,
    });
    return {
      statusCode: 200,
    };
  });

async function sendInvoiceToChat({
  chatId,
  cart,
  currency,
  botToken,
  providerToken,
  invoiceId,
}: {
  chatId: number;
  cart: ShoppingCart;
  currency: Currency;
  botToken: string;
  providerToken: string;
  invoiceId: string;
}) {
  const title = "Your Purchase";
  const description = cart.items
    .map((item) => `${item.product.name} x ${item.quantity}`)
    .join(", "); // List items purchased in the description
  const startParameter = "start"; // Used in deep-linking

  const prices = cart.items.map((item) => ({
    label: item.product.name,
    amount: parseInt(item.product.price) * item.quantity,
  }));

  const telegram = Telegram.fromToken(botToken);

  try {
    await telegram.api.sendInvoice({
      chat_id: chatId,
      title,
      description,
      payload: invoiceId,
      provider_token: providerToken,
      start_parameter: startParameter,
      currency,
      prices,
    });

    console.log("Invoice sent successfully");
  } catch (error) {
    console.error("Failed to send invoice:", error);
  }
}
