import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';

// Lazy-load Firebase methods
const lazyLoadFirebaseAuth = async (method) => {
  const authModule = await import('firebase/auth');
  return authModule[method];
};

export default function Dashboard() {
  const [user, setUser] = useState(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    const setupAuthStateListener = async () => {
      const onAuthStateChanged = await lazyLoadFirebaseAuth('onAuthStateChanged');
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
        } else {
          // Redirect to the home page if not authenticated
          navigate('/');
        }
      });

      // Cleanup the listener when the component unmounts
      return () => unsubscribe();
    };

    setupAuthStateListener();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const signOut = await lazyLoadFirebaseAuth('signOut');
      await signOut(auth);
      navigate('/'); // Redirect to the home page after logging out
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div>
      <h1>
        Dashboard {user?.displayName} {user?.email}
      </h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
