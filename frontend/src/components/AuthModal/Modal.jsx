import "./Modal.css";
import { Heading } from "@chakra-ui/react";

import { useState } from "react";

import SignInForm from "../SignInForm/SingInForm";
import SignUpForm from "../SignUpForm/SignUpForm";


export default function Modal ({ isOpen, onClose }) {
  if (!isOpen) return null;
 
  const [ panel, setPanel ] = useState(null);

  const swipeRight = () => { setPanel(null) };
  const swipeLeft = () => { setPanel("right-panel-active") };

  return (
    <div className="modal-overlay" >
        <div className="modal-content" onClick={onClose}>
            <div className={`container ${panel}`} id="container" onClick={(e) => e.stopPropagation()}>
                <SignUpForm />
                <SignInForm />
                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left">
                            <Heading size="3xl">Welcome Back!</Heading>
                            <p>To keep connected with us please login with your personal info</p>
                            <button className="ghost" id="signIn" onClick={swipeRight}>Sign In</button>
                        </div>
                        <div className="overlay-panel overlay-right">
                        <Heading size="3xl">Hello, Friend!</Heading>
                            <p>Enter your personal details and start journey with us</p>
                            <button className="ghost" id="signUp" onClick={swipeLeft}>Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
