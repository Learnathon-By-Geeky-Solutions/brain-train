import "./SignInForm.css";
import SocialContainer from "../SocialContainer/SocialContainer";
import { Heading } from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { auth } from "../../services/firebase";
import {
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { Alert } from "../ui/alert";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export default function SignInForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [info, setInfo] = useState("");

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const idToken = await userCredential.user.getIdToken();

      const response = await fetch(`${API_BASE_URL}/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        const username = await data.username;
        if (!auth.currentUser.displayName) {
          await updateProfile(auth.currentUser, {
            displayName: username,
          });
        }
        navigate("/dashboard");
      } else {
        setError(true);
        setErrorMessage("Failed to log in");
      }
    } catch (err) {
      const errorMessage = err.message;
      const errorCode = err.code;
      setError(true);
      switch (errorCode) {
        case "auth/invalid-credential":
          setErrorMessage("Invalid email or password.");
          break;
        case "auth/user-not-found":
          setErrorMessage("User not found.");
          break;
        case "auth/invalid-email":
          setErrorMessage("This email address is invalid.");
          break;
        default:
          setErrorMessage(errorMessage);
      }
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      setInfo("Please enter your email address.");
      setError(false);
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage("Password reset email sent! Check your inbox.");
      setError(false);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error sending password reset email:", err);
      setError(true);
      setErrorMessage("Failed to send password reset email. Please try again.");
    }
  };

  return (
    <div className="form-container sign-in-container">
      <form onSubmit={handleSubmit}>
        <Heading size="2xl">Sign in</Heading>
        <SocialContainer />
        <span>or use your account</span>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
        />
        {error && <Alert status="error">{errorMessage}</Alert>}
        {successMessage && <Alert status="success">{successMessage}</Alert>}
        {info && <Alert status="info">{info}</Alert>}
        <button
          type="button"
          style={{ marginTop: "10px" }}
          onClick={handleForgotPassword}
        >
          Forgot your password?
        </button>
        <button type="submit" style={{ marginTop: "10px" }}>
          Sign In
        </button>
      </form>
    </div>
  );
}
