import admin from "firebase-admin";
import { serverConfig } from "../config/ServerConfig.js";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serverConfig.serviceAccount),
  });
}

export const decodeFirebaseIdToken = async (idToken) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { email, name, picture } = decodedToken;
    return { email, name, picture };
  } catch (error) {
    console.error("Error verifying Firebase token:", error.message);
    throw new Error("Invalid authentication token");
  }
};
