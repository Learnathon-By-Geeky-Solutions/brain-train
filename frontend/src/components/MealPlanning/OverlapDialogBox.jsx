import {
    Button,
    Dialog,
    For,
    HStack,
    Portal,
    Flex,
    Text,
    List,
    ListItem,
  } from "@chakra-ui/react"
import { useState } from "react";
import AlertBox from "./Alert";
import { IoMdAlert } from "react-icons/io";
import { LuTriangleAlert } from "react-icons/lu";
  
  const Demo = ({clickFn}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [dailyPlans, setDailyPlans] = useState([]);
    const [weeklyPlans, setWeeklyPlans] = useState([]);
    return (
      <HStack wrap="wrap" gap="4">
        <Dialog.Root
            key="center"
            placement="center"
            motionPreset="slide-in-bottom"
        >
            <Dialog.Trigger 
              asChild
            >
            <Button
              onClick={()=>clickFn(setIsOpen, setDailyPlans, setWeeklyPlans)}
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
                    {/* <Flex directtion="column" alignItems="center" justifyContent="center"> */}
                    <LuTriangleAlert
                      size="60"
                      color="red"
                    />
                    <Text
                      color="red.500"
                      fontSize="2xl"
                    >
                    Oops!
                    </Text>
                    {/* </Flex> */}
                </Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>
                    <Text fontWeight="bold" fontSize="xl">The plan you tried to save has conflicts with the following plans</Text>
                    <List.Root spacing={3} my={4}>
                    <For each={dailyPlans}>
                        {(plan) => (
                            <List.Item color="blue.500" fontSize="lg">
                                {plan.title}
                            </List.Item>
                        )}
                    </For>
                    <For each={weeklyPlans}>
                        {(plan) => (
                            <List.Item color="blue.500" fontSize="lg">
                                {plan.title}
                            </List.Item>
                        )}
                    </For>
                    </List.Root>
                    <Text fontWeight="bold" fontSize="lg">Do you want to overwrite the existing plans?</Text>
                    <Text color="GrayText">Note: This action cannot be undone.</Text>
                </Dialog.Body>
                <Dialog.Footer>
                    <Dialog.ActionTrigger asChild>
                        <Button variant="outline" bgColor="bg.error">
                            Yes
                        </Button>
                    </Dialog.ActionTrigger>
                    <Dialog.ActionTrigger asChild>
                        <Button bgColor="bg.info" variant="subtle">No</Button>
                    </Dialog.ActionTrigger>
                </Dialog.Footer>
                </Dialog.Content>
            </Dialog.Positioner>
            </Portal>)}
        </Dialog.Root>
      </HStack>
    )
  }

export default Demo;