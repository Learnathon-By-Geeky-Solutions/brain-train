import admin from "firebase-admin";
import { serverConfig } from "../../config/ServerConfig.js";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serverConfig.serviceAccount),
    storageBucket: serverConfig.storageBucket,
  });
}

const firebaseBucket = admin.storage().bucket();

/**
 * Decodes a Firebase ID token from the provided authorization header.
 *
 * @param {string} authorizationHeader - The authorization header containing the Bearer token.
 * @returns {Promise<Object>} - A promise that resolves to the decoded token object.
 */
export const decodeFirebaseIdToken = async (authorizationHeader) => {
  const idToken = extractBearerToken(authorizationHeader);

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
  if (!header?.startsWith("Bearer "))
    throw new Error("Invalid authorization header");
  const token = header.split(" ")[1];
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
    const { email, name, picture, uid } = await admin
      .auth()
      .verifyIdToken(token);
    return { email, name, picture, uid };
  } catch (error) {
    throw new Error(
      `Invalid or expired authentication token: ${error.message}`,
    );
  }
};

/**
 * Uploads a file to Firebase Storage and returns its public URL.
 * @param {Object} file - The file object from multer (buffer, mimetype, originalname).
 * @param {string} folder - The folder to store the file in (default = 'uploads').
 * @returns {Promise<string>} Public image URL.
 */
export const uploadToFirebase = async (file, folder = "uploads") => {
  const fileName = `${folder}/${Date.now()}_${file.originalname}`;
  const blob = firebaseBucket.file(fileName);

  await new Promise((resolve, reject) => {
    const blobStream = blob.createWriteStream({
      metadata: { contentType: file.mimetype },
    });

    blobStream.on("error", reject).on("finish", resolve).end(file.buffer);
  });

  return `https://firebasestorage.googleapis.com/v0/b/${firebaseBucket.name}/o/${encodeURIComponent(fileName)}?alt=media`;
};
