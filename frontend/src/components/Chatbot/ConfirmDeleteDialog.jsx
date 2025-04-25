// ConfirmDeleteDialog.jsx
import { Dialog, Button, Portal } from "@chakra-ui/react";
import PropTypes from "prop-types";

export function ConfirmDeleteDialog({ onConfirm, dialogTriggerRef }) {
  return (
    <Dialog.Root role="alertdialog">
      <Dialog.Trigger asChild>
        <Button
          ref={dialogTriggerRef}
          onClick={(e) => {
            e.stopPropagation();
          }}
          display="none"
        >
          Invisible Button
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Delete Chat</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              Are you sure you want to delete this chat? This action cannot be
              undone.
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  Cancel
                </Button>
              </Dialog.ActionTrigger>
              <Dialog.ActionTrigger asChild>
                <Button
                  colorPalette="red"
                  onClick={(e) => {
                    onConfirm();
                    e.stopPropagation();
                  }}
                  ml={3}
                >
                  Delete
                </Button>
              </Dialog.ActionTrigger>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

ConfirmDeleteDialog.propTypes = {
  onConfirm: PropTypes.func,
  dialogTriggerRef: PropTypes.object,
};
