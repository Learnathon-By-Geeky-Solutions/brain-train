import dotenv from 'dotenv';

dotenv.config();

export const serverConfig = {
  cookieName: process.env.AUTH_COOKIE_NAME,
  cookieSignatureKeys: [
    process.env.AUTH_COOKIE_SIGNATURE_KEY_CURRENT,
    process.env.AUTH_COOKIE_SIGNATURE_KEY_PREVIOUS,
  ],
  cookieSerializeOptions: {
    path: "/",
    httpOnly: true,
    secure: process.env.USE_SECURE_COOKIES === "true",
    sameSite: "lax",
    maxAge: 12 * 60 * 60 * 24, // 12 days
  },
  serviceAccount: {
    project_id: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
};
