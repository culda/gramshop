import { S3 } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import { Bucket } from "sst/node/bucket";

const s3 = new S3({ region: "us-east-1" });

export async function PUT(req: NextRequest) {
  const base64 = await req.text();
  const file = Buffer.from(base64, "base64");
  await uploadFile("test.csv", file);

  return NextResponse.json({});
}

async function uploadFile(fileName: string, file: Buffer) {
  const result = await s3.putObject({
    Bucket: Bucket.ShopifyExportBucket.bucketName,
    Key: fileName,
    Body: file,
  });
  console.log(result);
}
