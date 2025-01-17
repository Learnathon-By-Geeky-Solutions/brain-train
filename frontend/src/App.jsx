import "./App.css";

import { useState } from "react";
import { useNavigate } from 'react-router-dom';

import Button from "./components/Button/Button";
import logo from "./assets/logo.png";
import VideoPlayer from "./components/VideoPlayer/VideoPlayer";
import AuthModal from "./components/AuthModal/Modal";
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
        <div className="menu-button">
          <Button icon="menuIcon" />
        </div>
      </nav>
      <div className="bg-video">
        <VideoPlayer />
        <div className="bg-cover">
          <div className="main-motto">Lorem Ipsum Lorem Ipsum</div>
          <div className="sub-motto">Dolor simit dlor simit</div>
          <div className="login-button">
            <Button text="Get Started Now" click={openModal}/>
          </div>
        </div>
      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={closeModal} />
    </div>
  )
}
