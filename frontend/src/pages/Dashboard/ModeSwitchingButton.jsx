import { useColorMode } from "@/components/ui/color-mode";
import { Icon, Switch } from "@chakra-ui/react";
import { FaMoon, FaSun } from "react-icons/fa";

const ModeSwitchingButton = () => {
  const { toggleColorMode } = useColorMode();
  return (
    <Switch.Root
      colorPalette="gray"
      size="lg"
      onCheckedChange={() => {
        toggleColorMode();
      }}
    >
      <Switch.HiddenInput />
      <Switch.Control>
        <Switch.Thumb />
        <Switch.Indicator fallback={<Icon as={FaMoon} color="gray.400" />}>
          <Icon as={FaSun} color="yellow.400" />
        </Switch.Indicator>
      </Switch.Control>
    </Switch.Root>
  );
};

export default ModeSwitchingButton;
