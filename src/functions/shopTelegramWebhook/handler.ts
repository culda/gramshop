import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import {
  InlineKeyboardMarkup,
  Keyboard,
  KeyboardBuilder,
  Telegram,
} from "puregram";
import { TelegramUpdate } from "puregram/generated";
import { ddb } from "../utils";
import {
  GetItemCommand,
  QueryCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { Table } from "sst/node/table";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { Invoice, Shop } from "@/model";

// const telegram = Telegram.fromToken(
//   "6491571682:AAFpv1_jUUF7UvZAoZmvZAiDBa0wRegrdXU" as string
// );

// const webAppUrl =
//   "https://ee4e-2a02-c7c-3670-4300-d5f0-3ef2-eb3-ff1b.ngrok-free.app";

// const inlineKeyboard = new InlineKeyboardMarkup({
//   inline_keyboard: [
//     [
//       {
//         text: "Shop Now",
//         url: webAppUrl,
//       },
//     ],
//   ],
//   force_reply: true,
// });

// const replyKeyboard = new KeyboardBuilder()
//   .webAppButton("Shop Now", webAppUrl)
//   .row() // Add 'Shop Now' button in a new row
//   .oneTime() // Optional: make the keyboard disappear after a button press
//   .resize(); // Optional: make the keyboard fit its buttons horizontally

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  console.log(event.body);

  if (
    event.headers["x-telegram-bot-api-secret-token"] !==
    process.env.TELEGRAM_WEBHOOK_SECRET
  ) {
    return {
      statucCode: 401,
    };
  }

  try {
    const update: TelegramUpdate = JSON.parse(event.body as string);
    const telegram = await getTelegram(update);

    if (!telegram) {
      throw new Error("Telegram not found");
    }

    const invoice = await handleUpdate({ update, telegram });

    if (invoice) {
      // set invoice status to processed
      await ddb.send(
        new UpdateItemCommand({
          TableName: Table.InvoicesTable.tableName,
          Key: marshall({ id: invoice }),
          UpdateExpression: "set #status = :status",
          ExpressionAttributeNames: {
            "#status": "status",
          },
          ExpressionAttributeValues: marshall({ ":status": "paid" }),
        })
      );
    }
  } catch (err) {
    console.log(err);
  } finally {
    return {
      statusCode: 200,
    };
  }
};

async function getTelegram(
  update: TelegramUpdate
): Promise<Telegram | undefined> {
  if (update.pre_checkout_query?.invoice_payload) {
    const { Item } = await ddb.send(
      new GetItemCommand({
        TableName: Table.InvoicesTable.tableName,
        Key: marshall({
          id: update.pre_checkout_query.invoice_payload,
        }),
      })
    );

    if (!Item) {
      throw new Error("Invoice not found");
    }

    const invoice = unmarshall(Item) as Invoice;

    console.log(invoice);

    const { Items } = await ddb.send(
      new QueryCommand({
        TableName: Table.ShopsTable.tableName,
        IndexName: "PublicIndex",
        KeyConditionExpression: "id = :id",
        ExpressionAttributeValues: marshall({ ":id": invoice.shopId }),
        ProjectionExpression: "botToken",
      })
    );

    if (!Items) {
      throw new Error("Shop not found");
    }

    const shop = unmarshall(Items[0]) as Shop;

    console.log(shop);

    return Telegram.fromToken(shop.botToken!);
  }
}

async function handleUpdate({
  update,
  telegram,
}: {
  update: TelegramUpdate;
  telegram: Telegram;
}): Promise<string | undefined> {
  const context = telegram.updates.handleUpdate(update);

  if (context?.is("pre_checkout_query")) {
    await telegram.api.answerPreCheckoutQuery({
      pre_checkout_query_id: context.id,
      ok: true,
    });

    return context.payload.invoice_payload;
  }
}
