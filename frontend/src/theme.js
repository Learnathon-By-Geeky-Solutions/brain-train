import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  initialColorMode: "dark", // Default to dark mode
  useSystemColorMode: false,
});

const system = createSystem(defaultConfig, config);

export default system;
