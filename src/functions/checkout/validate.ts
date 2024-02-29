import crypto from "crypto";

export function validateDataFromTelegram(
  dataCheckString: string,
  botToken: string
): boolean {
  const obj = new URLSearchParams(dataCheckString);
  const data = Array.from(obj.entries())
    .filter(([key]) => key !== "hash")
    .sort()
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  const secretKey = crypto
    .createHmac("sha256", "WebAppData")
    .update(botToken as string)
    .digest();

  // Calculate HMAC-SHA-256 signature
  const hmac = crypto
    .createHmac("sha256", secretKey)
    .update(data)
    .digest("hex");

  // Compare the computed hash with the provided hash
  return hmac === obj.get("hash");
}
