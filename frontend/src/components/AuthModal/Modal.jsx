import "./Modal.css";

import { useState } from "react";

import SignInForm from "../SignInForm/SingInForm";
import SignUpForm from "../SignUpForm/SignUpForm";


export default function Modal ({ isOpen, onClose }) {
  if (!isOpen) return null;
 
  const [ panel, setPanel ] = useState(null);

  const swipeRight = () => { setPanel(null) };
  const swipeLeft = () => { setPanel("right-panel-active") };

  return (
    <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className={`container ${panel}`} id="container">
                <SignUpForm />
                <SignInForm />
                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left">
                            <h1>Welcome Back!</h1>
                            <p>To keep connected with us please login with your personal info</p>
                            <button className="ghost" id="signIn" onClick={swipeRight}>Sign In</button>
                        </div>
                        <div className="overlay-panel overlay-right">
                            <h1>Hello, Friend!</h1>
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
