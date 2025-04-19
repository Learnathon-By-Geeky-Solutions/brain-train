import { initializeApp } from "firebase/app";
import { clientConfig } from "../config/ClientConfig";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const app = initializeApp(clientConfig.firebase);
const auth = getAuth(app);
const googleAuth = new GoogleAuthProvider();

export { app, auth, googleAuth };
