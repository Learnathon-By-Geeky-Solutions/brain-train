import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth'

export default function Dashboard() {
    const [ user, setUser ] = useState(undefined);
    const navigate = useNavigate();

    onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
            setUser(currentUser);
        } else {
            /**
             * TODO: 
             *  - Redirect to the home page with the auth modal open for sign in
             *  - Remove comment on completion
             */
            // If the user is authenticated, render the children (protected route), 
            // else redirect to home page.
            navigate("/");
        }
    })

    const handleLogout = async () => { 
        try {
			await signOut(auth);
            navigate("/") 
		} catch (error) {
			console.error("Error logging out:", error);
		}
    };

    return (
        <div>
            <h1>Dashboard {user?.displayName} {user?.email}</h1>
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}