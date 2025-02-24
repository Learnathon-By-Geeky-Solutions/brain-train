import { Box, Flex, IconButton, Image, Text, Button } from "@chakra-ui/react";
import PropTypes from 'prop-types';
import { FaBell, FaCog, FaHeart } from "react-icons/fa";
import logo from "../../assets/logo.png";
import { MdLogout } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";

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
} from "@/components/ui/drawer"

const StickyHeader = ({photoUrl,userName,handleLogout,setSearchParams}) => {
  const location = useLocation();
  const navigate = useNavigate();

  console.log("photoUrl",photoUrl);

  const showFavouriteRecipes= () => {
    console.log("Fetching favourite recipes...");
    if( location.pathname !== "/dashboard" && location.pathname !== "/dashboard/") {
      console.log("Navigating to dashboard");
      navigate({
        pathname: '/dashboard',
        search: `?type=favourites`,
      });
    }
    else{
      console.log("Just loading the cards");
      setSearchParams({ type: "favourites" });
    }
  }; 

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
      boxShadow="md"
    >
      <Flex
        alignItems="center"
        justifyContent="space-between"
        px={4}
        py={2}
        color="white"
      >
        {/* Logo and Title */}
        <Flex alignItems="center">
          <Box
            w="20"
            h="auto"
            display="flex"
            alignItems="center"
            justifyContent="center"
            mr={3}
          >
            <Image src={logo} alt="Logo" />
          </Box>
          <Text fontSize="3xl" fontWeight="semibold" color="var(--title-second-part-color)">
            Geeky Chef
          </Text>
        </Flex>

        {/* Icon Buttons */}
        <Flex gap={2}>
        <IconButton
            aria-label="User Profile"
            variant="ghost"
            w="10"
            h="auto"
          >
            <DrawerRoot>
              <DrawerBackdrop/>
              <DrawerTrigger asChild>
                <Image src={photoUrl} alt="User Profile" borderRadius="full"/>
              </DrawerTrigger>
              <DrawerContent offset="8" rounded="md" height="sm">
                <DrawerHeader>
                  <DrawerTitle>Hello {userName}</DrawerTitle>
                </DrawerHeader>
                <DrawerBody>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                    eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </p>
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
          <IconButton
            aria-label="Favorite Recipes"
            variant="ghost"
            w="10"
            h="auto"
            onClick={showFavouriteRecipes}
          >
            <FaHeart />
          </IconButton>
          <IconButton
            aria-label="Notifications"
            variant="ghost"
            borderRadius="full"
            w="10"
            h="auto"
            _hover={{ bg: "whiteAlpha.300", w: "10", h: "auto"}}
          >
            <FaBell borderRadius="full"/>
          </IconButton>
          <IconButton
            aria-label="Settings"
            variant="ghost"
            w="10"
            h="auto"
            _hover={{ bg: "whiteAlpha.300", w: "10", h: "auto"}}
            borderRadius="full"
          >
            <FaCog borderRadius="full"/>
          </IconButton>
        </Flex>
      </Flex>
    </Box>
  );
};
StickyHeader.propTypes = {
  photoUrl: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
  handleLogout: PropTypes.func.isRequired,
  setSearchParams: PropTypes.func.isRequired,
};

export default StickyHeader;
