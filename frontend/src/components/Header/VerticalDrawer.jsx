import { Drawer, IconButton, Portal } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { LuMenu, LuX } from "react-icons/lu";

const VerticalDrawer = ({ components, showSecondBar }) => {
  return (
    <Drawer.Root placement="start" hideFrom="md">
      <Drawer.Trigger asChild>
        <IconButton
          position={"absolute"}
          top={showSecondBar ? 4 : 2}
          left={showSecondBar ? 4 : 2}
          variant="ghost"
          hideFrom="md"
        >
          <LuMenu />
        </IconButton>
      </Drawer.Trigger>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Utilities</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>{components}</Drawer.Body>
            <Drawer.CloseTrigger asChild>
              <IconButton variant="ghost">
                <LuX />
              </IconButton>
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
};

export default VerticalDrawer;

VerticalDrawer.propTypes = {
  components: PropTypes.arrayOf(PropTypes.elementType).isRequired,
  showSecondBar: PropTypes.bool.isRequired,
};
