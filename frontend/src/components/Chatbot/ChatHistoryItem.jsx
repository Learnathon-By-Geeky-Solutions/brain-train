// ChatHistoryItem.jsx
import { HStack } from "@chakra-ui/react";
import { useState } from "react";
import { ChatActions } from "./ChatActions";
import { EditableChatName } from "./EditableChatName";

import PropTypes from "prop-types";

export function ChatHistoryItem({ name, onRename, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [chatName, setChatName] = useState(name);

  return (
    <HStack justifyContent="space-between" w="full" p={2} borderRadius="md">
      <EditableChatName
        name={chatName}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        setChatName={setChatName}
        onRename={onRename}
      />
      <ChatActions
        onRenameClick={() => setIsEditing(true)}
        onDeleteClick={() => onDelete(chatName)}
      />
    </HStack>
  );
}

//prop validation
ChatHistoryItem.propTypes = {
  name: PropTypes.string,
  onRename: PropTypes.func,
  onDelete: PropTypes.func,
};
