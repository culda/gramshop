import { AuthData, Currency, Shop, ShoppingCart, TgUser } from "@/model";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { Telegram } from "puregram";
import { lambdaWrapper } from "../lambdaWrapper";
import { ApiResponse, checkNull, checkTrue, ddb } from "../utils";
import { QueryCommand } from "@aws-sdk/client-dynamodb";
import { Table } from "sst/node/table";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { validateDataFromTelegram } from "./validate";

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

    await sendInvoiceToChat(
      user.id,
      data.cart,
      shop.currency,
      shop.botToken!,
      shop.providerToken!
    );
    return {
      statusCode: 200,
    };
  });

async function sendInvoiceToChat(
  chatId: number,
  cart: ShoppingCart,
  currency: Currency,
  botToken: string,
  providerToken: string
) {
  const title = "Your Purchase";
  const description = "Items you selected";
  const payload = "Unique-Payload-123"; // This should be unique for each invoice
  const startParameter = "start"; // Used in deep-linking
  const prices = cart.items.map((item) => ({
    label: item.product.name,
    amount: item.product.price, // Ensure this is in the smallest currency unit (e.g., cents)
  }));

  const telegram = Telegram.fromToken(botToken);

  try {
    await telegram.api.sendInvoice({
      chat_id: chatId,
      title,
      description,
      payload,
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
