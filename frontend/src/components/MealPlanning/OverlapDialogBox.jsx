import {
  Button,
  Dialog,
  For,
  HStack,
  Portal,
  List,
  Text,
} from "@chakra-ui/react";
import { useState, useRef } from "react";
import PropTypes from "prop-types";
import { LuTriangleAlert } from "react-icons/lu";

const Demo = ({ clickFn }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dailyPlans, setDailyPlans] = useState([]);
  const [weeklyPlans, setWeeklyPlans] = useState([]);
  const deleteOverlap = useRef(false);
  const saveButtonRef = useRef();
  return (
    <HStack wrap="wrap" gap="4">
      <Dialog.Root
        key="center"
        placement="center"
        motionPreset="slide-in-bottom"
        onExitComplete={() => setIsOpen(false)}
      >
        <Dialog.Trigger asChild>
          <Button
            onClick={() =>
              clickFn(
                setIsOpen,
                setDailyPlans,
                setWeeklyPlans,
                deleteOverlap.current,
              )
            }
            ref={saveButtonRef}
          >
            Save
          </Button>
        </Dialog.Trigger>
        {isOpen && (
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content>
                <Dialog.Header>
                  <Dialog.Title
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <LuTriangleAlert size="60" color="red" />
                    <Text color="red.500" fontSize="2xl">
                      Oops!
                    </Text>
                  </Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>
                  <Text fontWeight="bold" fontSize="xl">
                    The plan you tried to save has conflicts with the following
                    plans
                  </Text>
                  <List.Root spacing={3} my={4}>
                    {dailyPlans.length > 0 && (
                      <For each={dailyPlans}>
                        {(plan) => (
                          <List.Item color="blue.500" fontSize="lg">
                            {plan?.title}
                          </List.Item>
                        )}
                      </For>
                    )}
                    {weeklyPlans.length > 0 && (
                      <For each={weeklyPlans}>
                        {(plan) => (
                          <List.Item color="blue.500" fontSize="lg">
                            {plan?.title}
                          </List.Item>
                        )}
                      </For>
                    )}
                  </List.Root>
                  <Text fontWeight="bold" fontSize="lg">
                    Do you want to overwrite the existing plans?
                  </Text>
                  <Text color="GrayText">
                    Note: This action cannot be undone.
                  </Text>
                </Dialog.Body>
                <Dialog.Footer>
                  <Dialog.ActionTrigger asChild>
                    <Button
                      variant="outline"
                      bgColor="bg.error"
                      onClick={() => {
                        deleteOverlap.current = true;
                        saveButtonRef.current.click();
                      }}
                    >
                      Yes
                    </Button>
                  </Dialog.ActionTrigger>
                  <Dialog.ActionTrigger asChild>
                    <Button bgColor="bg.info" variant="subtle">
                      No
                    </Button>
                  </Dialog.ActionTrigger>
                </Dialog.Footer>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        )}
      </Dialog.Root>
    </HStack>
  );
};
Demo.propTypes = {
  clickFn: PropTypes.func.isRequired,
};

export default Demo;
