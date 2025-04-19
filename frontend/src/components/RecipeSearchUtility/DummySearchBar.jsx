import { Input, Flex } from "@chakra-ui/react";
const DummySearchBar = () => {
  return (
    <Flex
      direction="row"
      background="var(--text-input)"
      borderRadius="4xl"
      padding="2"
      ml={6}
      mr={6}
      alignItems="center"
      shadow="lg"
      shadowColor="bg.panel"
    >
      <Input
        width="65vw"
        h="1"
        color="white"
        placeholder="Search..."
        background="none"
        border="none"
        _focus={{ border: "none", boxShadow: "none" }}
        variant="flushed"
        fontSize="md"
        fontWeight="medium"
      />
    </Flex>
  );
};
export default DummySearchBar;
