import { Flex } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import './Dashboard.css';
import { Route, Routes, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { auth } from '@/services/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import Header from '@/components/Header/Header';
import recipes from './recipe';
import PreloadedCards from '@/components/DasboardFeatures/PreloadedCards';
import RecipeCardContainer from '@/components/RecipeCardContainer/RecipeCardContainer';
import fetchData, { getFavoriteRecipes } from './api';
import RecipeDetails from '@/components/RecipeDetails/RecipeDetails';



export default function Dashboard() {
  const [pageLocation, setPageLocation] = useState('dashboard');
  const [pageState, setPageState] = useState('init');
  const [cardData, setCardData] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  // Auth part
  const [user, setUser] = useState(undefined);
  const [photoURL, setPhotoURL] = useState(undefined);
  const navigate = useNavigate();
  let unsubscribe;

  useEffect(() => {
    if (location.pathname === '/dashboard' || location.pathname === '/dashboard/') {
      setPageLocation('dashboard');
    }
    else {
      setPageLocation('newValue');
    }

    setupAuthStateListener().then((currentUser) => {
      console.log('Auth state listener setup');
      if(currentUser){
        setUser(currentUser);
        setPhotoURL(currentUser.photoURL);
        loadCards("");
      }
    });
    return () => {
      if (unsubscribe)
        unsubscribe();
    };
  }, [navigate,searchParams]);

  useEffect(() => {
    const handlePopState = () => {
      // Clear search params when back button is pressed
      if (location.pathname === '/dashboard' || location.pathname === '/dashboard/'){
        setSearchParams({});
      }
    };

    window.addEventListener("popstate", handlePopState);
    
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const setupAuthStateListener = () => {
    return new Promise((resolve) => {
      unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          resolve(currentUser);  // Resolve with the user
        } else {
          navigate('/');
          resolve(null);
        }
      });
    });
  };


  function loadCards( data ) {

    const type = searchParams.get("type");
    console.log("Type: ", type);
    if(!data && !type)
    return;

    if(data){
      console.log("setting search params");
      console.log(data);
      setSearchParams({ type : "showResults" , q : encodeURIComponent(JSON.stringify(data)) });
      return;
    }

    if(type === "favourites"){
      console.log("Fetching favourite recipes from loop");
      getFavoriteRecipes().then((result) => {
        if(result.status === "success")
          setCardData(result.recipes);
        else
          console.error(result.msg);
      });
      return;
    }
    
    data = JSON.parse(decodeURIComponent(searchParams.get("q"))); 
    fetchData(data).then((result) => {
      setCardData(result);
    });
  }

  function removeCard(index) {
    let newCardData = [...cardData];
    newCardData.splice(index, 1);
    setCardData(newCardData);
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/'); // Redirect to the home page after logging out
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };


  return (
    <Flex direction="column" width="100%" height="100%" minHeight="100vh" 
    className="dashboard" gap={2}
    >
      <Header
        photoUrl={photoURL}
        userName={user?.displayName}
        handleLogout={handleLogout}
        setSearchParams={setSearchParams}
        pageState={pageState}
        pageLocation={pageLocation}
        setPageState={setPageState}
        showResults={loadCards}
      />
      {
        !searchParams.get("type") && pageLocation === 'dashboard' &&
        <Flex direction="column" width="100%" h="100%" className="dashboard">
          <PreloadedCards txt="Recently Searched" cards={recipes} />
          <PreloadedCards txt="Trending Recipes" cards={recipes} /> 
          <PreloadedCards txt="Explore a cuisine" cards={recipes} />
          <PreloadedCards txt="Recommended for You" cards={recipes} />
        </Flex>
      }
      { 
        searchParams.get("type") && pageLocation === 'dashboard' &&
        <RecipeCardContainer recipe_prop={cardData} removeCard={removeCard} perRow={4} numRows={5} />
      }
      <Routes>
        <Route path="recipe" element={<RecipeDetails />} />
      </Routes>
    </Flex>
  );
};