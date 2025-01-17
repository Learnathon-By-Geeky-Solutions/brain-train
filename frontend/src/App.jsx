import "./App.css";

import { useState } from "react";

import { Button, IconButton } from "@chakra-ui/react";
import logo from "./assets/logo.png";
import VideoPlayer from "./components/VideoPlayer/VideoPlayer";
import AuthModal from "./components/AuthModal/Modal";
import { LuMenu } from "react-icons/lu";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";

export default function App() {

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const openModal = () => setIsAuthModalOpen(true);
  const closeModal = () => setIsAuthModalOpen(false);

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
