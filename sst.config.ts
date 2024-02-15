import { SSTConfig } from "sst";
import { NextjsSite, Function, Api, Table, Bucket } from "sst/constructs";

export default {
  config(_input) {
    return {
      name: "gramshop",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const site = new NextjsSite(stack, "site");

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });

    app.stack(function Shop({ stack }) {
      // Buckets
      const webassetsBucket = new Bucket(stack, "WebAssetsBucket");

      // Tables
      const shopsTable = new Table(stack, "ShopsTable", {
        fields: {
          id: "string",
          userId: "string",
        },
        primaryIndex: { partitionKey: "id" },
        globalIndexes: {
          UserIdIndex: {
            partitionKey: "userId",
          },
        },
      });

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
        bind: [shopsTable],
        handler: "src/functions/initShop/handler.handler",
      });

      const productsHandler = new Function(stack, "productsHandler", {
        bind: [shopsTable],
        handler: "src/functions/products/handler.handler",
      });

      const api = new Api(stack, "Api", {
        routes: {
          "POST /shopwebhook": shopTelegramWebhookHandler,
          "POST /checkout": checkoutHandler,
          "POST /initShop": initShopHandler,
          "GET /products": productsHandler,
        },
      });

      stack.addOutputs({
        ApiEndpoint: api.url,
      });
    });
  },
} satisfies SSTConfig;
