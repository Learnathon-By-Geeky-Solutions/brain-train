import { Flex, IconButton } from '@chakra-ui/react';
import IngredientSearchForm from '@/components/IngredientSearchFormInput/IngredientSearchFormInput';
import { useEffect, useState } from 'react';
import RecipeCardContainer from '@/components/RecipeCardContainer/RecipeCardContainer';
import RecipeDetails from '@/components/RecipeDetails/RecipeDetails';

import './Dashboard.css';
import CentralSearchFrame from '@/components/CentralSearchFrame/CentralSearchFrame';
import Toolbar from '@/components/Toolbar/Toolbar';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { auth } from '@/services/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { MdLogout } from 'react-icons/md';
import TitleSearchInput from '@/components/TitleSearchInput/TitleSearchInput';
import Header from '@/components/Header/Header';
import DashboardFeatures from '@/components/DasboardFeatures/DashboardFeatures';


export default function Dashboard() {
  // const [pageLocation, setPageLocation] = useState('dashboard');
  // const [pageState, setPageState] = useState('init');

  // Auth part

  const [user, setUser] = useState(undefined);
  const [photoURL, setPhotoURL] = useState(undefined);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/'); // Redirect to the home page after logging out
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Auth part ends

  function changePageState(newState) {
    setPageState(newState);
  }
  const location = useLocation();

  useEffect(() => {
    // if (location.pathname === '/dashboard' || location.pathname === '/dashboard/') {
    //   setPageLocation('dashboard');
    // }
    // else {
    //   setPageLocation('newValue');
    // }
    const setupAuthStateListener = async () => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
          setPhotoURL(currentUser.photoURL);
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

  // const [badges, setBadges] = useState([]);
  // function modifyBadges(text, colorPalette) {
  //   const newBadges = [...badges];
  //   if (newBadges.find((badge) => badge.text === text)) {
  //     newBadges.splice(newBadges.findIndex((badge) => badge.text === text), 1);
  //     setBadges(newBadges);
  //     return;
  //   }
  //   newBadges.push({ text: text, colorPalette: colorPalette });
  //   setBadges(newBadges);
  // }

  return (
    <Flex direction="column" width="100%" height="100%" minHeight="100vh" 
    className="dashboard"
    >
      <Header photoUrl={photoURL} userName={user?.displayName} handleLogout={handleLogout}/>
      <DashboardFeatures />
    </Flex>
  );
};