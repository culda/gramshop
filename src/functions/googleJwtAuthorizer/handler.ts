import {
  APIGatewayAuthorizerHandler,
  APIGatewayAuthorizerResult,
} from "aws-lambda";
import { checkNull } from "../utils";
import { jwtDecode } from "jwt-decode";

export type AuthorizerContext = {
  userId?: string;
};

export const handler: APIGatewayAuthorizerHandler = async (event) => {
  if (event.type !== "REQUEST") {
    return generatePolicy("user", "Deny", event.methodArn);
  }

  // @ts-ignore
  const auth = checkNull(event?.identitySource, 403);
  const token = auth.split(" ")[1];

  try {
    const jwt = jwtDecode(token);
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
    } satisfies AuthorizerContext,
  };
}

export default handler;
