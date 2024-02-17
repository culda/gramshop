import { SSTConfig } from "sst";
import {
  NextjsSite,
  Function,
  Api,
  Table,
  Bucket,
  StackContext,
  use,
} from "sst/constructs";

function Storage({ stack }: StackContext) {
  // Buckets
  const ShopifyExportBucket = new Bucket(stack, "ShopifyExportBucket");

  // Tables
  const ShopsTable = new Table(stack, "ShopsTable", {
    fields: {
      id: "string",
      userId: "string",
    },
    primaryIndex: { partitionKey: "id" },
  });

  return {
    ShopifyExportBucket,
    ShopsTable,
  };
}

function Site({ stack }: StackContext) {
  const { ShopifyExportBucket } = use(Storage);

  const site = new NextjsSite(stack, "site", {
    bind: [ShopifyExportBucket],
  });

  stack.addOutputs({
    SiteUrl: site.url,
  });
}

function Shop({ stack }: StackContext) {
  const { ShopsTable } = use(Storage);

  /**
   * Called when a user interacts with a Telegram bot
   */
  const shopTelegramWebhookHandler = new Function(
    stack,
    "shopTelegramWebhookHandler",
    {
      handler: "src/functions/shopTelegramWebhook/handler.handler",
    }
  );

  /**
   * Called when the user clicks on the 'Checkout' button in the web app
   */
  const checkoutHandler = new Function(stack, "checkoutHandler", {
    handler: "src/functions/checkout/handler.handler",
  });

  /**
   * Called when the client sets up the shop
   * Creates a new shop in the database
   */
  const initShopHandler = new Function(stack, "initShopHandler", {
    bind: [ShopsTable],
    handler: "src/functions/initShop/handler.handler",
  });

  const getProductsHandler = new Function(stack, "getProductsHandler", {
    bind: [ShopsTable],
    handler: "src/functions/products/get/handler.handler",
  });

  const postProductsHandler = new Function(stack, "postProductsHandler", {
    bind: [ShopsTable],
    handler: "src/functions/products/add/handler.handler",
  });

  const api = new Api(stack, "Api", {
    routes: {
      "POST /shopwebhook": shopTelegramWebhookHandler,
      "POST /checkout": checkoutHandler,
      "POST /initShop": initShopHandler,
      "GET /products": getProductsHandler,
      "POST /products": postProductsHandler,
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}

export default {
  config(_input) {
    return {
      name: "gramshop",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(Storage).stack(Site).stack(Shop);
  },
} satisfies SSTConfig;
