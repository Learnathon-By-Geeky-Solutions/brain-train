import { Box, Flex, Image, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";
import logo from "../../assets/logo.png";
import { useLocation, useNavigate } from "react-router-dom";
import RecipeSearchUtility from "../RecipeSearchUtility/RecipeSearchUtility";

import { useState, useEffect } from "react";
import { throttle } from "lodash";
import { useColorModeValue } from "../ui/color-mode";
import Utilities from "./Utilities";
import NavButtons from "./NavButtons";
import VerticalDrawer from "./VerticalDrawer";

const StickyHeader = ({
  photoUrl,
  userName,
  handleLogout,
  setSearchParams,
  pageState,
  pageLocation,
  setPageState,
  showResults,
  scrollRef,
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
  const scrollDownEventExclusion = [
    "/dashboard/mealPlan",
    "/dashboard/chat",
    "/dashboard/recipe",
  ];
  const bgColor = useColorModeValue("white", "var(--header-bg)");

  const controlSecondBar = throttle((pathname, scrollYLatest) => {
    const currentScrollY = scrollRef?.current?.scrollTop || 0;
    // If we're at the top (or very close to it), always show the second bar
    if (
      currentScrollY < scrollYLatest &&
      currentScrollY < 5 &&
      !scrollDownEventExclusion.includes(pathname)
    ) {
      setShowSecondBar(true);
    }
    // Otherwise hide it when scrolling down
    else if (
      currentScrollY > scrollYLatest &&
      currentScrollY >= 100 &&
      containerClosed
    ) {
      setShowSecondBar(false);
    }
    // Update the last scroll position
    setLastScrollY(currentScrollY);
  }, 100);

  const handleScroll = () => {
    // use the latest location.pathname here
    controlSecondBar(location.pathname, lastScrollY);
  };

  useEffect(() => {
    if (scrollDownEventExclusion.includes(location.pathname)) {
      setShowSecondBar(false);
    } else {
      setShowSecondBar(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    const scrollableElement = scrollRef?.current;

    if (!scrollableElement || !containerClosed) {
      setShowSecondBar(true);
      return;
    }

    scrollableElement.addEventListener("scroll", handleScroll);

    return () => {
      scrollableElement.removeEventListener("scroll", handleScroll);
    };
  }, [containerClosed, lastScrollY]); // Only re-run the effect if lastScrollY changes

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

  const utilitiesForVerticalDrawer = (
    <Utilities
      setPageState={setPageState}
      setShowSecondBar={setShowSecondBar}
      hideFrom="md"
    />
  );

  const navButtonsForVerticalDrawer = (
    <NavButtons
      showSecondBar={showSecondBar}
      addFilter={addFilter}
      clearFilters={clearFilters}
      userName={userName}
      photoUrl={photoUrl}
      showFavouriteRecipes={showFavouriteRecipes}
      handleLogout={handleLogout}
      hideFrom="md"
    />
  );

  return (
    <Box
      as="header"
      position="sticky"
      top="0"
      left="0"
      width="100%"
      zIndex="1000"
      bg={bgColor}
      backdropFilter="blur(10px)"
    >
      <Flex direction="column" gap={4} pt={showSecondBar ? 5 : 2} pb={2} px={7}>
        <Flex
          alignItems="center"
          justifyContent={{
            base: "center",
            sm: "center",
            md: "space-between",
          }}
          color="white"
        >
          {/* Hamburger Menu for Mobile */}
          <VerticalDrawer
            components={[
              navButtonsForVerticalDrawer,
              utilitiesForVerticalDrawer,
            ]}
            showSecondBar={showSecondBar}
          />
          {/* Logo and Title */}
          <Flex
            alignItems="center"
            _hover={{ cursor: "pointer" }}
            onClick={() => {
              navigate("/dashboard");
            }}
          >
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
            <Utilities
              setPageState={setPageState}
              setShowSecondBar={setShowSecondBar}
              hideBelow="md"
            />
          )}

          {/* Icon Buttons */}
          <NavButtons
            showSecondBar={showSecondBar}
            addFilter={addFilter}
            clearFilters={clearFilters}
            userName={userName}
            photoUrl={photoUrl}
            showFavouriteRecipes={showFavouriteRecipes}
            handleLogout={handleLogout}
            hideBelow="md"
          />
        </Flex>
        <Box
          transform={
            showSecondBar ? "translateY(0) " : "translateY(-20%) scale(0.6)"
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
  showResults: PropTypes.func.isRequired,
  scrollRef: PropTypes.object.isRequired,
};

export default StickyHeader;
