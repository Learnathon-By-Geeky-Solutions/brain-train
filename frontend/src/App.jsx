import "./App.css";

import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

import { Button, IconButton, Theme } from "@chakra-ui/react";
import logo from "./assets/logo.png";
import VideoPlayer from "./components/VideoPlayer/VideoPlayer";
import AuthModal from "./components/AuthModal/Modal";
import { LuMenu } from "react-icons/lu";
import { auth } from "./services/firebase";

// Lazy-load Firebase methods
const lazyLoadFirebaseAuth = async (method) => {
  const authModule = await import('firebase/auth');
  return authModule[method];
};


export default function App() {
  const navigate = useNavigate();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const openModal = () => setIsAuthModalOpen(true);
  const closeModal = () => setIsAuthModalOpen(false);

  // onAuthStateChanged(auth, (currentUser) => {
  //   if (currentUser) navigate('/dashboard');
  // });
  useEffect(() => {
    const setupAuthListener = async () => {
      const onAuthStateChanged = await lazyLoadFirebaseAuth('onAuthStateChanged');
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          navigate('/dashboard');
        } 
      });

      // Cleanup the listener when the component unmounts
      return () => unsubscribe();
    };

    setupAuthListener();
  }, [navigate]);

  return (
    <Theme appearance="light">
    <div className="app">
      <nav className="nav-bar">
        <div className="logo">
          <img src={logo} alt="logo" />
        </div>
        <div className="title">
          Geeky <span className="title-second-part">Chef</span>
        </div>
        <IconButton aria-label="menu" color="white" className="menu-button">
          <LuMenu />
        </IconButton> 
      </nav>
      <div className="bg-video">
        <VideoPlayer />
        <div className="bg-cover">
          <div className="main-motto">Lorem Ipsum Lorem Ipsum</div>
          <div className="sub-motto">Dolor simit dlor simit</div>
          <Button onClick={openModal} className="login-button">Login</Button>
        </div>
      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={closeModal} />
    </div>
    </Theme>
  )
}
