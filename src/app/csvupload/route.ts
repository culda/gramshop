import { S3 } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import { Bucket } from "sst/node/bucket";
import { csvToJson } from "./csvToJson";

const s3 = new S3({ region: "us-east-1" });

export async function PUT(req: NextRequest) {
  const base64 = await req.text();
  const file = Buffer.from(base64, "base64").toLocaleString();

  try {
    const parsed = await csvToJson(file);
    return NextResponse.json(parsed);
  } catch (error) {
    console.error(error);
    return NextResponse.json({}, { status: 500 });
  }
}

async function uploadFile(fileName: string, file: Buffer) {
  const result = await s3.putObject({
    Bucket: Bucket.ShopifyExportBucket.bucketName,
    Key: fileName,
    Body: file,
  });
  console.log(result);
}
