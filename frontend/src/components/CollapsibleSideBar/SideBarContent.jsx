import React, { useState } from "react";
import { Box, IconButton, Flex } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { MdChat } from "react-icons/md";
import PropTypes from "prop-types";
import { ChatHistoryItem } from "../Chatbot/ChatHistoryItem";
import { deleteChat, renameChat } from "./api";
import { toaster } from "../ui/toaster";

const MotionBox = motion(Box);

const SideBarContent = ({
  isOpen,
  onToggle,
  navItems,
  loadChat,
  clearChat,
  toggleRefresh,
}) => {
  const [selectedNavItemIdx, setSelectedNavItemIdx] = useState(0);
  const newNavItems = [{ _id: null, name: "New Chat" }, ...navItems];

  function handleDeleteChat(id) {
    deleteChat(id).then((response) => {
      if (response.status !== "error") {
        toaster.create({
          title: "Success",
          description: "Chat deleted successfully.",
          type: "success",
          duration: 3000,
          isClosable: true,
        });
        toggleRefresh();
      } else {
        toaster.create({
          title: "Error",
          description: response.message,
          type: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    });
  }

  function handleRenameChat(id, newName) {
    // Implement rename functionality here
    renameChat(id, newName).then((response) => {
      if (response.status !== "error") {
        toaster.create({
          title: "Success",
          description: "Chat renamed successfully.",
          type: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toaster.create({
          title: "Error",
          description: response.message,
          type: "error",
          duration: 3000,
          isClosable: true,
        });
      }
      toggleRefresh();
    });
  }

  return (
    <MotionBox
      w={
        isOpen
          ? { base: "50vw", sm: "50vw", mdTo2xl: "25vw" }
          : { base: "12vw", sm: "12vw", mdTo2xl: "5vw" }
      }
      bg="green.600"
      color="white"
      transition="width 0.3s"
      overflow="hidden"
      h={{ base: "94.5vh", sm: "94.5vh", mdTo2xl: "90vh" }}
      position="fixed"
      top={{ base: "5.5vh", sm: "5.5vh", mdTo2xl: "10vh" }}
      p={3}
      overflowY="auto"
      zIndex="999"
    >
      <Flex
        position="fixed"
        top={{ base: "5.5vh", sm: "5.5vh", mdTo2xl: "10vh" }}
        left="0"
        w={isOpen ? "25vw" : "5vw"}
        bg="green.600"
        zIndex={3}
        direction={isOpen ? "row" : "column"}
        justifyContent="space-between"
      >
        <IconButton
          aria-label="Toggle sidebar"
          onClick={onToggle}
          size="sm"
          m="2"
          bg="green.500"
          _hover={{ bg: "green.400" }}
        >
          {isOpen ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
        </IconButton>
        <IconButton
          aria-label="New Chat"
          onClick={() => {
            if (selectedNavItemIdx == 0) {
              toggleRefresh();
            }
            setSelectedNavItemIdx(0);
            clearChat(false);
          }}
          size="sm"
          m="2"
          bg="green.500"
          _hover={{ bg: "green.400" }}
        >
          <MdChat size={18} />
        </IconButton>
      </Flex>

      {isOpen && (
        <Flex
          direction="column"
          spacing={4}
          align="stretch"
          position="relative"
          zIndex={2}
          mt="10"
        >
          {newNavItems?.map((item, idx) => (
            <Box
              key={item._id || "69"}
              display="flex"
              alignItems="center"
              p={2}
              bg={selectedNavItemIdx === idx ? "green.500" : "none"}
              _hover={
                selectedNavItemIdx === idx
                  ? {}
                  : { bg: "green.500", cursor: "pointer" }
              }
              borderRadius="md"
              onClick={() => {
                if (selectedNavItemIdx !== idx) {
                  setSelectedNavItemIdx(idx);
                  if (item._id === null) {
                    clearChat(false);
                  } else {
                    loadChat(item._id);
                  }
                }
              }}
            >
              <ChatHistoryItem
                name={item.name}
                onRename={(newName) => handleRenameChat(item._id, newName)}
                onDelete={() => handleDeleteChat(item._id)}
              />
            </Box>
          ))}
        </Flex>
      )}
    </MotionBox>
  );
};

SideBarContent.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  navItems: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  loadChat: PropTypes.func.isRequired,
  clearChat: PropTypes.func.isRequired,
  toggleRefresh: PropTypes.func.isRequired,
};

export default SideBarContent;
