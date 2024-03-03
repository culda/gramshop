import { NextRequest, NextResponse } from "next/server";
import { csvToJson } from "./csvToJson";
import { Product, TempShop, convertToSmallUnit } from "@/model";
import { S3 } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { Bucket } from "sst/node/bucket";
import { nanoid } from "nanoid";
import {
  DynamoDBClient,
  PutItemCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { Table } from "sst/node/table";
import { marshall } from "@aws-sdk/util-dynamodb";

const s3 = new S3({ region: "us-east-1" });
const ddb = new DynamoDBClient({ region: "us-east-1" });

export async function PUT(req: NextRequest) {
  const base64 = await req.text();
  const file = Buffer.from(base64, "base64").toLocaleString();

  try {
    const parsed = ((await csvToJson(file)) as Product[]).map((product) => {
      return {
        ...product,
        price: convertToSmallUnit(product.price),
      };
    });
    const shopId = nanoid(10);
    const products = await productImagesToS3(shopId, parsed);
    await updateTempShop(shopId, products);
    return NextResponse.json({
      id: shopId,
      products,
    } satisfies TempShop);
  } catch (error) {
    console.error(error);
    return NextResponse.json({}, { status: 500 });
  }
}

async function updateTempShop(shopId: string, products: Product[]) {
  await ddb.send(
    new UpdateItemCommand({
      TableName: Table.TempShopTable.tableName,
      Key: { id: { S: shopId } },
      UpdateExpression: "SET products = :products",
      ExpressionAttributeValues: marshall({ ":products": products }),
    })
  );
}

async function productImagesToS3(
  shopId: string,
  products: Product[]
): Promise<Product[]> {
  for (let product of products) {
    if (product.image) {
      let response = await fetch(product.image);
      let imageBuffer = await response.arrayBuffer();

      try {
        const sharp = require("sharp");

        // Image optimization
        imageBuffer = await sharp(imageBuffer)
          .resize({
            width: 1080,
            height: 1080,
            fit: "inside",
            withoutEnlargement: true,
          }) // Resize to max width/height
          .toFormat("webp") // Convert to Webp with 80% quality
          .toBuffer();
      } catch (err) {
        console.log(err);
      }

      const imageKey = `${shopId}/${product.id}/${randomUUID()}`;
      const imageBucket = Bucket.ImagesBucket.bucketName;
      await s3.putObject({
        Bucket: imageBucket,
        Key: imageKey,
        Body: Buffer.from(imageBuffer),
        ContentType: "image/webp",
      });

      product.image = `https://${imageBucket}.s3.amazonaws.com/${imageKey}`;
    }
  }

  return products;
}
