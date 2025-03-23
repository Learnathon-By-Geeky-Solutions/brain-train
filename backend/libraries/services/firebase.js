import admin from "firebase-admin";
import { serverConfig } from "../../config/ServerConfig.js";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serverConfig.serviceAccount),
  });
}

/**
 * Decodes and verifies a Firebase ID token.
 * @param {string} authorizationHeader - The authorization header containing the ID token in the format 'Bearer <token>'.
 * @returns {Promise<Object>} A promise that resolves to an object containing user information (email, name, picture, uid).
 * @throws {Error} Throws an error if the token is invalid, missing, or verification fails.
 */
export const decodeFirebaseIdToken = async (authorizationHeader) => {
  if (!authorizationHeader?.startsWith('Bearer ')) {
    throw new Error("No token provided or token format is incorrect");
  }

  const idToken = authorizationHeader.split(' ')[1];

  if (!idToken) {
    throw new Error("Token is missing after 'Bearer '");
  }
  console.log("Decoding Firebase token:", idToken);

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { email, name, picture, uid } = decodedToken;
    return { email, name, picture, uid };  // Return all required info
  } catch (error) {
    console.error("Error verifying Firebase token:", error.message);
    throw new Error("Invalid or expired authentication token");
  }
};

