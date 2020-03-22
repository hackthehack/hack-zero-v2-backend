import jwt from "jsonwebtoken";
import axios from "axios";
import jwkToPem from "jwk-to-pem";

const generatePolicy = (principalId, effect, resource) => {
  const authResponse = {};
  authResponse.principalId = principalId;
  if (effect && resource) {
    const policyDocument = {};
    policyDocument.Version = "2012-10-17";
    policyDocument.Statement = [];
    const statementOne = {};
    statementOne.Action = "execute-api:Invoke";
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }
  return authResponse;
};
export const auth = async (event, context) => {
  const token = event.authorizationToken;

  if (!token) return "Not authorized, no token!!";
};
