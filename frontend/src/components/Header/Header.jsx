import {
  Box,
  Flex,
  IconButton,
  Image,
  Text,
  Button,
  Avatar,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import logo from "../../assets/logo.png";
import { MdLogout } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import RecipeSearchUtility from "../RecipeSearchUtility/RecipeSearchUtility";

import {
  DrawerActionTrigger,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { LuMenu } from "react-icons/lu";
import { useState, useEffect } from "react";
import FilterController from "../RecipeSearchUtility/filter";

const StickyHeader = ({
  photoUrl,
  userName,
  handleLogout,
  setSearchParams,
  pageState,
  pageLocation,
  setPageState,
  showResults,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [filters, setFilters] = useState([
    { cuisine: "" },
    { diet: null },
    { rangeFilters: null },
  ]);
  const [showSecondBar, setShowSecondBar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [containerClosed, setContainerClosed] = useState(true);

  const controlSecondBar = () => {
    // Get current scroll position
    const currentScrollY = window.scrollY;

    // If we're at the top (or very close to it), always show the second bar
    if (currentScrollY < 10 && location.pathname !== "/dashboard/mealPlan") {
      setShowSecondBar(true);
    }
    // Otherwise hide it when scrolling down
    else if (currentScrollY > lastScrollY && containerClosed) {
      setShowSecondBar(false);
    }
    // Update the last scroll position
    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
    if (containerClosed) window.addEventListener("scroll", controlSecondBar);
    else setShowSecondBar(true);
    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener("scroll", controlSecondBar);
    };
  }, [lastScrollY, containerClosed]); // Only re-run the effect if lastScrollY changes

  const showFavouriteRecipes = () => {
    showResults(null, true);
    if (
      location.pathname !== "/dashboard" &&
      location.pathname !== "/dashboard/"
    ) {
      navigate({
        pathname: "/dashboard",
        search: `?type=favourites`,
      });
    } else {
      setSearchParams({ type: "favourites" });
    }
  };

  function changePageState(newState) {
    setSearchParams({});
    setPageState(newState);
  }

  function addFilter(filter) {
    const newFilters = [...filters];
    let i;
    for (i = 0; i < filter.length; i++) {
      newFilters[i] = filter[i];
    }
    setFilters(newFilters);
  }

  function clearFilters() {
    setFilters([]);
  }

  return (
    <Box
      as="header"
      position="sticky"
      top="0"
      left="0"
      width="100%"
      h="100%"
      zIndex="1000"
      bg="rgba(20, 20, 20, 0.8)"
      backdropFilter="blur(10px)"
    >
      <Flex direction="column" gap={4} pt={showSecondBar ? 5 : 2} pb={2} px={7}>
        <Flex alignItems="center" justifyContent="space-between" color="white">
          {/* Logo and Title */}
          <Flex alignItems="center">
            <Box
              w="10"
              h="auto"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Image src={logo} alt="Logo" />
            </Box>
            <Text
              fontSize="2xl"
              fontWeight="semibold"
              color="var(--title-second-part-color)"
            >
              Geeky Chef
            </Text>
          </Flex>

          {showSecondBar && (
            <Flex gap={2}>
              <Button
                variant="subtle"
                borderRadius="3xl"
                onClick={() => {
                  setShowSecondBar(true);
                  changePageState("init");
                }}
              >
                Recipe Search
              </Button>
              <Button
                variant="subtle"
                borderRadius="3xl"
                onClick={() => {
                  setShowSecondBar(true);
                  changePageState("ingSearch");
                }}
              >
                Pantry Match
              </Button>
              <Button
                variant="subtle"
                borderRadius="3xl"
                onClick={() => {
                  navigate("/dashboard/mealPlan");
                }}
              >
                Meal Plan
              </Button>
            </Flex>
          )}

          {/* Icon Buttons */}
          <Flex gap={2}>
            {showSecondBar && (
              <FilterController
                addFilter={addFilter}
                clearFilters={clearFilters}
              />
            )}
            <IconButton aria-label="User Profile" variant="ghost" h="auto">
              <DrawerRoot>
                <DrawerBackdrop />
                <DrawerTrigger asChild>
                  <IconButton
                    borderRadius="3xl"
                    variant="outline"
                    p={1}
                    borderColor="whiteAlpha.300"
                    bgColor="var(--text-input)"
                    _hover={{ shadow: "md" }}
                  >
                    <Flex
                      direction="row"
                      alignItems="center"
                      justifyContent="space-around"
                      h="12"
                      gap={1}
                    >
                      <LuMenu />
                      {/* <Image src={photoUrl} alt="DP" borderRadius="full" h="8" w="auto" ml="auto"/> */}
                      <Avatar.Root size="xs" variant="outline">
                        <Avatar.Fallback name={userName} />
                        <Avatar.Image src={photoUrl} />
                      </Avatar.Root>
                    </Flex>
                  </IconButton>
                  {/* <Image src={photoUrl} alt="User Profile" borderRadius="full"/> */}
                </DrawerTrigger>
                <DrawerContent offset="8" rounded="md" height="sm">
                  <DrawerHeader>
                    <DrawerTitle>Hello {userName}</DrawerTitle>
                  </DrawerHeader>
                  <DrawerBody>
                    <Flex direction="column" mt={2}>
                      <DrawerActionTrigger asChild>
                        <Button onClick={showFavouriteRecipes} variant="ghost">
                          Favourite Recipes
                        </Button>
                      </DrawerActionTrigger>
                      <Button variant="ghost">Dummy</Button>
                    </Flex>
                  </DrawerBody>
                  <DrawerFooter>
                    <DrawerActionTrigger asChild>
                      <Button variant="outline">Cancel</Button>
                    </DrawerActionTrigger>
                    <IconButton variant="outline" p={2} onClick={handleLogout}>
                      <MdLogout />
                      Sign Out
                    </IconButton>
                  </DrawerFooter>
                  <DrawerCloseTrigger />
                </DrawerContent>
              </DrawerRoot>
            </IconButton>
          </Flex>
        </Flex>
        <Box
          transform={
            showSecondBar ? "translateY(0) " : "translateY(-20%) scale(0.5)"
          }
          transition="transform 0.3s, opacity 0.3s "
          position={!showSecondBar ? "absolute" : "relative"}
          placeSelf={!showSecondBar ? "center" : "auto"}
        >
          <RecipeSearchUtility
            pageState={pageState}
            setPageState={setPageState}
            pageLocation={pageLocation}
            showResults={showResults}
            setSearchParams={setSearchParams}
            filters={filters}
            setShowSecondBar={setShowSecondBar}
            showSecondBar={showSecondBar}
            setContainerClosed={setContainerClosed}
            containerClosed={containerClosed}
            controlSecondBar={controlSecondBar}
          />
        </Box>
      </Flex>
    </Box>
  );
};
StickyHeader.propTypes = {
  photoUrl: PropTypes.string,
  userName: PropTypes.string,
  handleLogout: PropTypes.func.isRequired,
  setSearchParams: PropTypes.func.isRequired,
  pageState: PropTypes.string.isRequired,
  pageLocation: PropTypes.string.isRequired,
  setPageState: PropTypes.func.isRequired,
  showResults: PropTypes.bool.isRequired,
};

export default StickyHeader;
