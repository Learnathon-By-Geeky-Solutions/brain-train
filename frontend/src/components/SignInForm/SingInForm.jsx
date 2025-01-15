import './SignInForm.css';
import SocialContainer from '../SocialContainer/SocialContainer';
import { Heading } from '@chakra-ui/react';

import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function SignInForm() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);

    // Implement the login function
    const login = () => { 
        // console.log(email);
        // console.log(password);
        navigate("/Dashboard");
    };

    return (
        <div className="form-container sign-in-container">
            <form>
                <Heading size="3xl" color="black">Sign in</Heading>
                <SocialContainer />
                <span >or use your account</span>
                <input type="email" placeholder="Email" onChange={handleEmailChange}/>
                <input type="password" placeholder="Password" onChange={handlePasswordChange}/>
                <a href="#">Forgot your password?</a>
                <button onClick={login}>Sign In</button>
            </form>
        </div>
    )
}