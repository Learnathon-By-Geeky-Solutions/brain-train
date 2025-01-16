import './SignInForm.css';
import SocialContainer from '../SocialContainer/SocialContainer';

import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { auth } from '../../services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function SignInForm() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const idToken = await userCredential.user.getIdToken();

            const response = await fetch('http://localhost:8000/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}`,
                },
            });
            if (!response.ok) {
                setError(true);
                setErrorMessage('Failed to log in');
                return;
            }
            navigate('/dashboard');
        } catch (err) {
            const errorMessage = err.message;
            const errorCode = err.code;
            setError(true);
            if (errorCode === 'auth/invalid-credential') {
                setErrorMessage('Invalid email or password.');
            } else {
                setErrorMessage(errorMessage);
            }
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        if (!email) {
            setError(true);
            setErrorMessage('Please enter your email to reset your password.');
            return;
        }
        try {
            await sendPasswordResetEmail(auth, email);
            setSuccessMessage('Password reset email sent! Check your inbox.');
            setError(false);
        } catch (err) {
            setError(true);
            setErrorMessage('Failed to send password reset email. Please try again.');
        }
    };
    

    return (
        <div className="form-container sign-in-container">
            <form onSubmit={handleSubmit}>
                <h1>Sign in</h1>
                <SocialContainer />
                <span>or use your account</span>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={handleEmailChange}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={handlePasswordChange}
                />
                <button type="button" onClick={handleForgotPassword}>Forgot your password?</button>
                <button type="submit">Sign In</button>
                {error && <p className="error-message">{errorMessage}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}
            
            </form>
        </div>
    )
}