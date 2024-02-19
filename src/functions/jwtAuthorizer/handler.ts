import {
  APIGatewayAuthorizerHandler,
  APIGatewayAuthorizerResult,
} from "aws-lambda";
import { decode } from "next-auth/jwt";
import { checkNull } from "../utils";

export type AuthorizerContext = {
  userId?: string;
};

export const handler: APIGatewayAuthorizerHandler = async (event) => {
  if (event.type !== "REQUEST") {
    return generatePolicy("user", "Deny", event.methodArn);
  }

  // @ts-ignore
  const authHeader = checkNull(event?.identitySource, 403);
  const token = checkNull(extractSessionToken(authHeader), 403);

  try {
    const jwt = await decode({
      token,
      secret: Buffer.from(process.env.SECRET as string),
    });
    return generatePolicy("user", "Allow", event.methodArn, jwt?.sub);
  } catch (e) {
    return generatePolicy("user", "Deny", event.methodArn);
  }
};

function generatePolicy(
  principalId: string,
  effect: string,
  resource: string,
  userId?: string
): APIGatewayAuthorizerResult {
  const policyDocument = {
    Version: "2012-10-17",
    Statement: [
      {
        Action: "execute-api:Invoke",
        Effect: effect,
        Resource: resource,
      },
    ],
  };

  return {
    principalId: principalId,
    policyDocument: policyDocument,
    context: {
      userId,
    },
  };
}

function extractSessionToken(authorizationToken: string) {
  // Define the cookie name we're looking for
  const cookieName = "next-auth.session-token=";

  // Find the start of the cookie value
  const start = authorizationToken.indexOf(cookieName);
  if (start === -1) {
    // Cookie not found
    return null;
  }

  // Compute the starting index of the cookie's value
  const valueStart = start + cookieName.length;

  // Assuming the cookie value ends with the next space or is at the end of the string
  // However, in your case, it seems like it might run till the end of the string
  let end = authorizationToken.indexOf(" ", valueStart);
  if (end === -1) {
    // If there's no space, the cookie value goes till the end of the string
    end = authorizationToken.length;
  }

  // Extract and return the cookie value
  return authorizationToken.substring(valueStart, end);
}

export default handler;
