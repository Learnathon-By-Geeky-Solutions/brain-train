import "./Modal.css";
import { Heading, IconButton } from "@chakra-ui/react";

import { useState } from "react";

import SignInForm from "../SignInForm/SingInForm";
import SignUpForm from "../SignUpForm/SignUpForm";
import PropTypes from "prop-types";
import { LuX } from "react-icons/lu";

function Modal({ isOpen, onClose }) {
  const [panel, setPanel] = useState(null);
  const swipeRight = () => {
    setPanel(null);
  };
  const swipeLeft = () => {
    setPanel("right-panel-active");
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className={`container ${panel}`} id="container">
          <SignUpForm />
          <SignInForm />
          <div className="overlay-container">
            <div className="overlay">
              <div className="overlay-panel overlay-left">
                <Heading size="3xl">Welcome Back!</Heading>
                <p>
                  To keep connected with us please login with your personal info
                </p>
                <button className="ghost" id="signIn" onClick={swipeRight}>
                  Sign In
                </button>
              </div>
              <div className="overlay-panel overlay-right">
                <Heading size="3xl">Hello, Friend!</Heading>
                <p>Enter your personal details and start journey with us</p>
                <button className="ghost" id="signUp" onClick={swipeLeft}>
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <IconButton
        borderRadius="full"
        variant="outline"
        position="relative"
        zIndex="1002"
        right="8"
        top="8"
        marginBottom="auto"
      >
        <LuX onClick={onClose} />
      </IconButton>
    </div>
  );
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Modal;
