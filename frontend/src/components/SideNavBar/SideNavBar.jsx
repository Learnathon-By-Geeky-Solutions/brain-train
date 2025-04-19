import { Box, VStack, IconButton, Tooltip } from "@chakra-ui/react";
import "./SideNavBar.css";
import { LuMenu } from "react-icons/lu";

export default function SideNavBar() {
  return (
    <Box
      position="fixed"
      left="0"
      top="0"
      height="100vh"
      width="60px"
      bg="gray.800"
      color="white"
      display="flex"
      justifyContent="center"
      alignItems="center"
      boxShadow="lg"
      className="side-nav"
    >
      <VStack spacing={6}>
        <Tooltip label="Menu" fontSize="sm">
          <IconButton
            aria-label="Menu"
            variant="ghost"
            color="white"
            _hover={{ bg: "gray.700" }}
          >
            <LuMenu />
          </IconButton>
        </Tooltip>
        <Tooltip label="Settings" fontSize="sm">
          <IconButton
            aria-label="Settings"
            variant="ghost"
            color="white"
            _hover={{ bg: "gray.700" }}
          />
        </Tooltip>
        <Tooltip label="Info" fontSize="sm">
          <IconButton
            aria-label="Info"
            variant="ghost"
            color="white"
            _hover={{ bg: "gray.700" }}
          />
        </Tooltip>
      </VStack>
    </Box>
  );
}
