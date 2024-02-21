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
    primaryIndex: { partitionKey: "id", sortKey: "userId" },
    globalIndexes: {
      UserIdIndex: {
        partitionKey: "userId",
      },
    },
  });

  stack.addOutputs({
    ShopifyExportBucketName: ShopifyExportBucket.bucketName,
    ShopsTableName: ShopsTable.tableName,
  });

  return {
    ShopifyExportBucket,
    ShopsTable,
  };
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

  const getListShopHandler = new Function(stack, "getListShopHandler", {
    bind: [ShopsTable],
    handler: "src/functions/shop/getlist/handler.handler",
  });

  const getShopHandler = new Function(stack, "getShopHandler", {
    bind: [ShopsTable],
    handler: "src/functions/shop/get/handler.handler",
  });

  const putShopHandler = new Function(stack, "putShopHandler", {
    bind: [ShopsTable],
    handler: "src/functions/shop/put/handler.handler",
  });

  const postShopHandler = new Function(stack, "postShopHandler", {
    bind: [ShopsTable],
    handler: "src/functions/shop/post/handler.handler",
  });

  const loginHandler = new Function(stack, "loginHandler", {
    handler: "src/functions/login/handler.handler",
  });

  const jwtAuthorizer = new Function(stack, "jwtAuthorizer", {
    handler: "src/functions/jwtAuthorizer/handler.handler",
    environment: {
      SECRET: process.env.NEXTAUTH_SECRET as string,
    },
  });

  const api = new Api(stack, "Api", {
    authorizers: {
      jwt: {
        type: "lambda",
        function: jwtAuthorizer,
        identitySource: ["$request.header.Cookie"],
      },
    },
    routes: {
      "POST /shopwebhook": {
        function: shopTelegramWebhookHandler,
        authorizer: "none",
      },
      "POST /checkout": checkoutHandler,
      "POST /initShop": initShopHandler,
      "GET /products": getProductsHandler,
      "GET /shops": getListShopHandler,
      "GET /shops/{id}": getShopHandler,
      "PUT /shops": putShopHandler,
      "POST /shops": postShopHandler,
      "POST /products": postProductsHandler,
      "GET /login": loginHandler,
    },
    defaults: {
      authorizer: "jwt",
    },
  });

  return {
    Api: api,
  };
}

function Site({ stack }: StackContext) {
  const { ShopifyExportBucket } = use(Storage);
  const { Api } = use(Shop);

  const site = new NextjsSite(stack, "site", {
    bind: [ShopifyExportBucket, Api],
    environment: {
      NEXT_PUBLIC_API_ENDPOINT:
        stack.stage === "production"
          ? (Api.customDomainUrl as string)
          : Api.url, // available on the client
      API_ENDPOINT:
        stack.stage === "production"
          ? (Api.customDomainUrl as string)
          : Api.url, // available on the server
    },
  });

  stack.addOutputs({
    SiteUrl: site.url,
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
    app.stack(Storage).stack(Shop).stack(Site);
  },
} satisfies SSTConfig;
