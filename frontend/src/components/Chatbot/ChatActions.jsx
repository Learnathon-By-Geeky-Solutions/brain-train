// ChatActions.jsx
import { IconButton, Menu, Portal } from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import { useRef } from "react";
import PropTypes from "prop-types";
import { LuPencil, LuTrash } from "react-icons/lu";

export function ChatActions({ onRenameClick, onDeleteClick }) {
  const handleConfirmDelete = () => {
    onDeleteClick();
  };

  const dialogTriggerRef = useRef(null);

  return (
    <Menu.Root closeOnSelect={true}>
      <Menu.Trigger onClick={(e) => e.stopPropagation()}>
        <IconButton variant="ghost" size="sm" _hover={{ bg: "none" }}>
          <BsThreeDotsVertical />
        </IconButton>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item
              value="rename"
              onClick={(e) => {
                onRenameClick();
                e.stopPropagation();
              }}
            >
              Rename
              <LuPencil />
            </Menu.Item>
            <Menu.Item
              value="delete"
              color="fg.error"
              onClick={(e) => {
                dialogTriggerRef.current.click();
                e.stopPropagation();
              }}
            >
              Delete
              <LuTrash />
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
        <ConfirmDeleteDialog
          onConfirm={handleConfirmDelete}
          dialogTriggerRef={dialogTriggerRef}
        />
      </Portal>
    </Menu.Root>
  );
}

ChatActions.propTypes = {
  onRenameClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
};
