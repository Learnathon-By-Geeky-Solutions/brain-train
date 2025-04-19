import "./SignUpForm.css";
import SocialContainer from "../SocialContainer/SocialContainer";

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { auth } from "../../services/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Alert } from "../ui/alert";
import { Heading } from "@chakra-ui/react";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export default function SignUpForm() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleNameChange = (e) => setName(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      setError(true);
      setErrorMessage("Name is required");
    } else if (!email) {
      setError(true);
      setErrorMessage("Email is required");
    } else if (!password) {
      setError(true);
      setErrorMessage("Password is required");
    } else {
      try {
        const usernameAvailable = await checkUsernameAvailability();
        if (!usernameAvailable) {
          setError(true);
          setErrorMessage("Username is already taken.");
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        const idToken = await userCredential.user.getIdToken();

        const user = auth.currentUser;
        await updateProfile(user, {
          displayName: name,
        });

        const response = await fetch(`${API_BASE_URL}/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            name: name,
            email: email,
          }),
        });

        if (response.ok) {
          navigate("/dashboard");
        } else {
          const err = await response.json();
          setError(true);
          setErrorMessage(err.error);
          setErrorMessage("Failed to sign up");
        }
      } catch (err) {
        const errorMessage = err.message;
        const errorCode = err.code;
        setError(true);
        switch (errorCode) {
          case "auth/weak-password":
            setErrorMessage("The password is too weak.");
            break;
          case "auth/email-already-in-use":
            setErrorMessage(
              "This email address is already in use by another account.",
            );
            break;
          case "auth/invalid-email":
            setErrorMessage("This email address is invalid.");
            break;
          case "auth/operation-not-allowed":
            setErrorMessage("Email/password accounts are not enabled.");
            break;
          default:
            setErrorMessage(errorMessage);
            break;
        }
      }
    }
  };

  const checkUsernameAvailability = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/checkUsername`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: name }),
      });

      const data = await response.json();
      return data.available;
    } catch (error) {
      console.error("Error checking username availability:", error.message);
      setError(true);
      setErrorMessage("Unable to check username availability");
      return false;
    }
  };

  return (
    <div className="form-container sign-up-container">
      <form onSubmit={handleSubmit}>
        <Heading size="2xl">Create Account</Heading>
        <SocialContainer />
        <span>or use your email for registration</span>
        <input type="text" placeholder="Name" onChange={handleNameChange} />
        <input type="email" placeholder="Email" onChange={handleEmailChange} />
        <input
          type="password"
          placeholder="Password"
          onChange={handlePasswordChange}
        />
        {error && <Alert status="error">{errorMessage}</Alert>}
        <button type="submit" style={{ marginTop: "10px" }}>
          Sign Up
        </button>
      </form>
    </div>
  );
}
