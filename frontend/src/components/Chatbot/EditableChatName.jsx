import { Editable } from "@chakra-ui/react";
import { useRef } from "react";
import PropTypes from "prop-types";

export function EditableChatName({
  name,
  isEditing,
  setIsEditing,
  setChatName,
  onRename,
}) {
  const inputRef = useRef();

  const handleSubmit = (newName) => {
    setChatName(newName);
    onRename(newName);
  };

  return (
    <Editable.Root
      defaultValue={name}
      selectOnFocus={false}
      edit={isEditing}
      onFocusOutside={() => setIsEditing(false)}
      onInteractOutside={() => setIsEditing(false)}
    >
      <Editable.Preview bg="none" />
      <Editable.Input
        bg="none"
        color="white"
        ref={inputRef}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            inputRef.current.blur();
            handleSubmit(e.target.value);
          }
        }}
      />
    </Editable.Root>
  );
}

EditableChatName.propTypes = {
  name: PropTypes.string,
  isEditing: PropTypes.bool,
  setIsEditing: PropTypes.func,
  setChatName: PropTypes.func,
  onRename: PropTypes.func,
};
