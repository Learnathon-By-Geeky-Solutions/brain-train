import "./App.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Theme } from "@chakra-ui/react";
import AuthModal from "./components/AuthModal/Modal";
import { auth } from "./services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import GeekyChefLanding from "./pages/LandingPage/LandingPage";

export default function App() {
  const navigate = useNavigate();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const openModal = () => setIsAuthModalOpen(true);
  const closeModal = () => setIsAuthModalOpen(false);

  useEffect(() => {
    const setupAuthListener = async () => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          navigate("/dashboard");
        }
      });

      // Cleanup the listener when the component unmounts
      return () => unsubscribe();
    };

    setupAuthListener();
  }, [navigate]);

  return (
    <Theme appearance="light">
      <GeekyChefLanding openAuthModal={openModal} />
      <AuthModal isOpen={isAuthModalOpen} onClose={closeModal} />
    </Theme>
  );
}
