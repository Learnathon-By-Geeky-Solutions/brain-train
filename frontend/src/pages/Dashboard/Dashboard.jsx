import { Flex, Input, Button, IconButton } from '@chakra-ui/react';
import IngredientSearchForm from '@/components/IngredientSearchFormInput/IngredientSearchFormInput';
import { useEffect, useRef, useState } from 'react';
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


export default function Dashboard() {
  const [pageLocation, setPageLocation] = useState('dashboard');
  const [pageState, setPageState] = useState('init');

  // Auth part

  const [user, setUser] = useState(undefined);
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
    if (location.pathname === '/dashboard' || location.pathname === '/dashboard/') {
      setPageLocation('dashboard');
    }
    else {
      setPageLocation('newValue');
    }
    const setupAuthStateListener = async () => {
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
  }, [navigate, location]);

  const [badges, setBadges] = useState([]);
  function modifyBadges(text, colorPalette) {
    const newBadges = [...badges];
    if (newBadges.find((badge) => badge.text === text)) {
      newBadges.splice(newBadges.findIndex((badge) => badge.text === text), 1);
      setBadges(newBadges);
      return;
    }
    newBadges.push({ text: text, colorPalette: colorPalette });
    setBadges(newBadges);
  }

  return (
    <Flex direction="column" width="100%" height="100%" minHeight="100vh" alignItems="center" className="dashboard">
      <IconButton marginLeft="auto" marginRight="20px" marginTop="20px">
        <MdLogout onClick={handleLogout} />
      </IconButton>
      {
        pageLocation === 'dashboard' && (
          <div className="dashboard-header welcome-message">Welcome {user?.displayName}</div>
        )
      }
      {pageState === 'init' && pageLocation === 'dashboard' && (
        <Flex direction="column" width="100%" height="100vh" alignItems="center" className="dashboard">
          <CentralSearchFrame feature={TitleSearchInput} currentBadges={badges} changeBadges={(text, color) => { modifyBadges(text, color) }} />
          <Toolbar click={[() => { changePageState('ingSearch') }]} />
        </Flex>
      )}
      {
        pageState === 'ingSearch' && pageLocation === 'dashboard' && (
          <CentralSearchFrame feature={IngredientSearchForm} featureProps={{ prevState: () => { changePageState('init') }, ref:null } } currentBadges={badges} changeBadges={(text, color) => { modifyBadges(text, color) }} />
        )
      }
      <Routes>
        <Route path="recipes" element={<RecipeCardContainer />}/>
        <Route path="recipe" element={<RecipeDetails />}/>
      </Routes>
    </Flex>
  );
};