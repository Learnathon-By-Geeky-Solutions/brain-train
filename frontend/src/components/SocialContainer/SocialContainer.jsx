import './SocialContainer.css';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleAuth } from '../../services/firebase';
import { useNavigate } from 'react-router-dom';
import GoogleButton from 'react-google-button';

export default function SocialContainer() {
    const navigate = useNavigate();

    const handleGoogleSignIn = async () => {
        try {
            const credential = await signInWithPopup(auth, googleAuth);
            const idToken = await credential.user.getIdToken();
            
            const response = await fetch("http://localhost:8000/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${idToken}`,
                },
            });

            const data = await response.json();
            if (response.ok) {
                const username = await data.username;
                if (!auth.currentUser.displayName) {
                    await updateProfile(auth.currentUser, {
                        displayName: username,
                    });
                }
                navigate('/dashboard');
            }
        } catch (error) {
            console.error("Error during Google sign-in", error.message);
        }
    };

    return (
        <div className="social-container">
            <GoogleButton
            type="light"
            style={{ fontSize: "20px" }}
            onClick={() => { handleGoogleSignIn() }}
            />
        </div>
    )
}