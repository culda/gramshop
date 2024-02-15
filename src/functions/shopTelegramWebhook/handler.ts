import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import {
  InlineKeyboardMarkup,
  Keyboard,
  KeyboardBuilder,
  Telegram,
} from "puregram";
import { TelegramUpdate } from "puregram/generated";

const telegram = Telegram.fromToken(
  "6491571682:AAFpv1_jUUF7UvZAoZmvZAiDBa0wRegrdXU" as string
);

const webAppUrl =
  "https://ee4e-2a02-c7c-3670-4300-d5f0-3ef2-eb3-ff1b.ngrok-free.app";

const inlineKeyboard = new InlineKeyboardMarkup({
  inline_keyboard: [
    [
      {
        text: "Shop Now",
        url: webAppUrl,
      },
    ],
  ],
  force_reply: true,
});

const replyKeyboard = new KeyboardBuilder()
  .webAppButton("Shop Now", webAppUrl)
  .row() // Add 'Shop Now' button in a new row
  .oneTime() // Optional: make the keyboard disappear after a button press
  .resize(); // Optional: make the keyboard fit its buttons horizontally

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  console.log(event.body);
  try {
    const update: TelegramUpdate = JSON.parse(event.body as string);
    await handleUpdate(update);
  } catch (err) {
    console.log(err);
  } finally {
    return {
      statusCode: 200,
    };
  }
};

async function handleUpdate(u: TelegramUpdate) {
  const context = await telegram.updates.handleUpdate(u);

  if (context?.is("message")) {
    const { text, chat } = context;

    if (text === "/start") {
      await telegram.api.sendMessage({
        chat_id: chat.id,
        text: "Welcome to our shop!",
        reply_markup: replyKeyboard,
      });
    }
  }
}
