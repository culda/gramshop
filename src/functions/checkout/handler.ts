import { AuthData, Product } from "@/model";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { Telegram } from "puregram";

const telegram = Telegram.fromToken(
  "6491571682:AAFpv1_jUUF7UvZAoZmvZAiDBa0wRegrdXU" as string
);

export type CheckoutRequestPayload = {
  items: Product[];
  auth: AuthData;
};

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  console.log(event.body);
  const checkoutPayload: CheckoutRequestPayload = JSON.parse(
    event.body as string
  );
  sendInvoiceToChat(checkoutPayload);
  return {
    statusCode: 200,
  };
};

async function sendInvoiceToChat(checkoutPayload: CheckoutRequestPayload) {
  const chatId = checkoutPayload.auth.user.id;
  const title = "Your Purchase";
  const description = "Items you selected";
  const payload = "Unique-Payload-123"; // This should be unique for each invoice
  const providerToken = "284685063:TEST:MDYzZjc4YWU4NDVj"; // From BotFather
  const startParameter = "start"; // Used in deep-linking
  const currency = "USD"; // Currency code
  const prices = checkoutPayload.items.map((item) => ({
    label: item.name,
    amount: item.price, // Ensure this is in the smallest currency unit (e.g., cents)
  }));

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
