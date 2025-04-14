import admin from "firebase-admin";
import { serverConfig } from "../../config/ServerConfig.js";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serverConfig.serviceAccount),
  });
}

/**
 * Decodes a Firebase ID token from the provided authorization header.
 *
 * @param {string} authorizationHeader - The authorization header containing the Bearer token.
 * @returns {Promise<Object>} - A promise that resolves to the decoded token object.
 */
export const decodeFirebaseIdToken = async (authorizationHeader) => {
  const idToken = extractBearerToken(authorizationHeader);
  console.log("idToken", idToken);
  return verifyToken(idToken);
};

/**
 * Extracts the Bearer token from an authorization header.
 *
 * @param {string} header - The authorization header containing the Bearer token.
 * @returns {string} The extracted Bearer token.
 * @throws {Error} If the header does not start with 'Bearer ' or if the token is missing.
 */
const extractBearerToken = (header) => {
  if (!header?.startsWith('Bearer ')) throw new Error("Invalid authorization header");
  const token = header.split(' ')[1];
  if (!token) throw new Error("Token missing after 'Bearer '");
  return token;
};

/**
 * Verifies a Firebase authentication token and extracts user information.
 *
 * @param {string} token - The Firebase authentication token to verify.
 * @returns {Promise<{email: string, name: string, picture: string, uid: string}>} 
 * A promise that resolves to an object containing the user's email, name, picture, and uid.
 * @throws {Error} If the token is invalid or expired.
 */
const verifyToken = async (token) => {
  try {
    const { email, name, picture, uid } = await admin.auth().verifyIdToken(token);
    return { email, name, picture, uid };
  } catch (error) {
    console.error("Error verifying Firebase token:", error.message);
    throw new Error("Invalid or expired authentication token");
  }
};
