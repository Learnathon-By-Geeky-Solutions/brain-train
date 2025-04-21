import { Flex, IconButton } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import "./Dashboard.css";
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { auth } from "@/services/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import Header from "@/components/Header/Header";
import PreloadedCards from "@/components/DasboardFeatures/PreloadedCards";
import RecipeCardContainer from "@/components/RecipeCardContainer/RecipeCardContainer";
import fetchData, { getFavoriteRecipes } from "./api";
import RecipeDetails from "@/components/RecipeDetails/RecipeDetails";
import ShoppingList from "@/components/RecipeDetails/ShoppingList";
import MealPlanningCalendar from "@/components/MealPlanning/MealPlan";
import { LuMessageCircle } from "react-icons/lu";
import ChatBot from "@/components/Chatbot/ChatBot";
import FoodImageAnalysis from "@/components/ImageAnalysis/ImageAnalysis";

export default function Dashboard() {
  const [pageLocation, setPageLocation] = useState("dashboard");
  const [pageState, setPageState] = useState("init");
  const [cardData, setCardData] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const scrollRef = useRef(null);

  // Auth part
  const [user, setUser] = useState(undefined);
  const [photoURL, setPhotoURL] = useState(undefined);
  const navigate = useNavigate();
  let unsubscribe;

  useEffect(() => {
    if (
      location.pathname === "/dashboard" ||
      location.pathname === "/dashboard/"
    ) {
      setPageLocation("dashboard");
    } else {
      setPageLocation("newValue");
    }

    setupAuthStateListener().then((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setPhotoURL(currentUser.photoURL);
        loadCards("");
      }
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [navigate, searchParams]);

  const setupAuthStateListener = () => {
    return new Promise((resolve) => {
      unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          resolve(currentUser); // Resolve with the user
        } else {
          navigate("/");
          resolve(null);
        }
      });
    });
  };

  function loadCards(data, clearCards = false) {
    const type = searchParams.get("type");

    if (clearCards) {
      setCardData([]);
      return;
    }

    if (!data && !type) return;

    if (data) {
      setCardData([]);
      if (
        location.pathname !== "/dashboard" &&
        location.pathname !== "/dashboard/"
      ) {
        navigate({
          pathname: "/dashboard",
          search: `?type=showResults&q=${encodeURIComponent(JSON.stringify(data))}&t=${Date.now()}`,
        });
      } else {
        setSearchParams({
          type: "showResults",
          q: encodeURIComponent(JSON.stringify(data)),
          t: Date.now(),
        });
      }
      return;
    }

    if (type === "favourites") {
      getFavoriteRecipes().then((result) => {
        if (result.status === "success") setCardData(result.recipes);
        else
          // eslint-disable-next-line no-console
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
      navigate("/"); // Redirect to the home page after logging out
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error logging out:", error);
    }
  };

  return (
    <Flex
      direction="column"
      width="100%"
      h="100vh"
      className="dashboard"
      position="fixed"
      overflowY="auto"
      ref={scrollRef}
      gap={0}
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
        scrollRef={scrollRef}
      />
      {!searchParams.get("type") && pageLocation === "dashboard" && (
        <Flex direction="column" width="100%" h="100%" className="dashboard">
          <PreloadedCards txt="Recently Searched" />
          <PreloadedCards txt="Trending Recipes" />
          <PreloadedCards txt="Explore a cuisine" showResults={loadCards} />
          <PreloadedCards txt="Recommended for You" />
        </Flex>
      )}
      {searchParams.get("type") && pageLocation === "dashboard" && (
        <RecipeCardContainer
          recipe_prop={cardData}
          removeCard={removeCard}
          scrollable={false}
        />
      )}
      {location.pathname !== "/dashboard/chat" && (
        <IconButton
          borderRadius="full"
          position="fixed"
          bottom="4"
          right="4"
          size="xl"
          zIndex="1010"
          onClick={() => {
            navigate("/dashboard/chat");
          }}
        >
          <LuMessageCircle />
        </IconButton>
      )}
      <Routes>
        <Route path="mealPlan" element={<MealPlanningCalendar />} />
        <Route path="recipe/*" element={<RecipeDetails />} />
        <Route path="shoppingList" element={<ShoppingList />} />
        <Route path="chat" element={<ChatBot photoURL={photoURL} />} />
        <Route path="imageAnalysis" element={<FoodImageAnalysis />} />
      </Routes>
    </Flex>
  );
}
