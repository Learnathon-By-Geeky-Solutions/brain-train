import "./App.css";

import { useState } from "react";
import { useNavigate } from 'react-router-dom';

import { Button, IconButton } from "@chakra-ui/react";
import logo from "./assets/logo.png";
import VideoPlayer from "./components/VideoPlayer/VideoPlayer";
import AuthModal from "./components/AuthModal/Modal";
import { LuMenu } from "react-icons/lu";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import { auth } from "./services/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function App() {
  const navigate = useNavigate();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const openModal = () => setIsAuthModalOpen(true);
  const closeModal = () => setIsAuthModalOpen(false);

  onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) navigate('/dashboard');
  });

  return (
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
  )
}
