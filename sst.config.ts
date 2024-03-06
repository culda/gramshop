import { SSTConfig } from "sst";
import * as lambda from "aws-cdk-lib/aws-lambda";
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
  const ImagesBucket = new Bucket(stack, "ImagesBucket", {
    cdk: {
      bucket: {
        publicReadAccess: true,
      },
    },
  });

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
      PublicIndex: {
        partitionKey: "id",
      },
    },
  });

  const TempShopsTable = new Table(stack, "TempShopTable", {
    fields: {
      id: "string",
    },
    primaryIndex: { partitionKey: "id" },
  });

  const InvoicesTable = new Table(stack, "InvoicesTable", {
    fields: {
      id: "string",
    },
    primaryIndex: { partitionKey: "id" },
  });

  return {
    ImagesBucket,
    ShopsTable,
    TempShopsTable,
    InvoicesTable,
  };
}

function Shop({ stack }: StackContext) {
  const { ImagesBucket } = use(Storage);
  const { ShopsTable, InvoicesTable } = use(Storage);

  /**
   * Called when a user interacts with a Telegram bot
   */
  const shopTelegramWebhookHandler = new Function(
    stack,
    "shopTelegramWebhookHandler",
    {
      bind: [InvoicesTable, ShopsTable],
      handler: "src/functions/shopTelegramWebhook/handler.handler",
      environment: {
        TELEGRAM_WEBHOOK_SECRET: process.env.TELEGRAM_WEBHOOK_SECRET as string,
      },
    }
  );

  const checkoutHandler = new Function(stack, "checkoutHandler", {
    bind: [ShopsTable, InvoicesTable],
    handler: "src/functions/checkout/handler.handler",
  });

  const getPublicShopHandler = new Function(stack, "getPublicShopHandler", {
    bind: [ShopsTable],
    handler: "src/functions/shop/getpublic/handler.handler",
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
    bind: [ImagesBucket, ShopsTable],
    handler: "src/functions/shop/put/handler.handler",
  });
  putShopHandler.addLayers(
    new lambda.LayerVersion(stack, "SharpLayer", {
      code: lambda.Code.fromAsset("src/layers/sharp"),
    })
  );

  const postShopHandler = new Function(stack, "postShopHandler", {
    bind: [ShopsTable],
    handler: "src/functions/shop/post/handler.handler",
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
    customDomain:
      stack.stage === "production" ? "api.gramshop.co" : "api-dev.gramshop.co",
    routes: {
      "POST /shopwebhook": {
        function: shopTelegramWebhookHandler,
        authorizer: "none",
      },
      /**
       * Called when the user clicks on the 'Checkout' button in the web app
       */
      "POST /checkout": {
        function: checkoutHandler,
        authorizer: "none",
      },
      "GET /public/shop": {
        function: getPublicShopHandler,
        authorizer: "none",
      },
      "GET /shops": getListShopHandler,
      "GET /shops/{id}": getShopHandler,
      "PUT /shops": putShopHandler,
      "POST /shops": postShopHandler,
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
  const { ImagesBucket, TempShopsTable } = use(Storage);
  const { Api } = use(Shop);

  const site = new NextjsSite(stack, "site", {
    bind: [ImagesBucket, TempShopsTable, Api],
    permissions: ["dynamodb"],
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
    customDomain:
      stack.stage === "production"
        ? {
            domainName: "gramshop.co",
            domainAlias: `www.gramshop.co`,
          }
        : {
            domainName: `dev.gramshop.co`,
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
