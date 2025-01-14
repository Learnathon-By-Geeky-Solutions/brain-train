import admin from "firebase-admin";
import { serverConfig } from "../config/serverConfig.js";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serverConfig.serviceAccount),
  });
}

export const verifyFirebaseToken = async (idToken) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name } = decodedToken;

    return { uid, email, name };
  } catch (error) {
    console.error("Error verifying Firebase token:", error.message);
    throw new Error("Invalid authentication token");
  }
};
