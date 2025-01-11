import './SignUpForm.css';
import SocialContainer from '../SocialContainer/SocialContainer';

import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function SignUpForm() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleNameChange = (e) => setName(e.target.value);
    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);

    // Implement the signup function
    const signup = () => { 
        // console.log(name);
        // console.log(email);
        // console.log(password);
        navigate("/Dashboard") 
    };

    return (
        <div className="form-container sign-up-container">
            <form action="#">
                <h1>Create Account</h1>
                <SocialContainer />
                <span>or use your email for registration</span>
                <input type="text" placeholder="Name" onChange={handleNameChange} />
                <input type="email" placeholder="Email" onChange={handleEmailChange} />
                <input type="password" placeholder="Password" onChange={handlePasswordChange} />
                <button onClick={signup}>Sign Up</button>
            </form>
        </div>
    )
}