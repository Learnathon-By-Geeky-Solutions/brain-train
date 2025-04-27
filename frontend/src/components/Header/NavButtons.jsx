import { Flex, IconButton, Button, Avatar } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { MdLogout } from "react-icons/md";

import {
  DrawerActionTrigger,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { LuMenu } from "react-icons/lu";
import FilterController from "../RecipeSearchUtility/filter";
import ModeSwitchingButton from "@/pages/Dashboard/ModeSwitchingButton";

const NavButtons = ({
  showSecondBar,
  addFilter,
  clearFilters,
  userName,
  photoUrl,
  showFavouriteRecipes,
  handleLogout,
  hideFrom,
  hideBelow,
}) => {
  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      hideBelow={hideBelow}
      hideFrom={hideFrom}
      mb={{ base: 4, sm: 4, md: 0 }}
      gap={{ base: undefined, sm: undefined, md: 2 }}
    >
      <ModeSwitchingButton />
      {showSecondBar && (
        <FilterController addFilter={addFilter} clearFilters={clearFilters} />
      )}
      <DrawerRoot>
        <DrawerBackdrop />
        <DrawerTrigger asChild>
          <IconButton
            borderRadius="3xl"
            variant="outline"
            p={1}
            _hover={{ shadow: "md" }}
          >
            <Flex
              direction="row"
              alignItems="center"
              justifyContent="space-around"
              h="12"
              gap={1}
            >
              <LuMenu />
              <Avatar.Root size="xs" variant="outline">
                <Avatar.Fallback name={userName} />
                <Avatar.Image src={photoUrl} />
              </Avatar.Root>
            </Flex>
          </IconButton>
        </DrawerTrigger>
        <DrawerContent offset="8" rounded="md" height="sm">
          <DrawerHeader>
            <DrawerTitle>Hello {userName}</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <Flex direction="column" mt={2}>
              <DrawerActionTrigger asChild>
                <Button onClick={showFavouriteRecipes} variant="ghost">
                  Favourite Recipes
                </Button>
              </DrawerActionTrigger>
            </Flex>
          </DrawerBody>
          <DrawerFooter>
            <DrawerActionTrigger asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerActionTrigger>
            <IconButton variant="outline" p={2} onClick={handleLogout}>
              <MdLogout />
              Sign Out
            </IconButton>
          </DrawerFooter>
          <DrawerCloseTrigger />
        </DrawerContent>
      </DrawerRoot>
      {/* </IconButton> */}
    </Flex>
  );
};

export default NavButtons;

NavButtons.propTypes = {
  showSecondBar: PropTypes.bool.isRequired,
  addFilter: PropTypes.func.isRequired,
  clearFilters: PropTypes.func.isRequired,
  userName: PropTypes.string.isRequired,
  photoUrl: PropTypes.string.isRequired,
  showFavouriteRecipes: PropTypes.func.isRequired,
  handleLogout: PropTypes.func.isRequired,
  hideFrom: PropTypes.string,
  hideBelow: PropTypes.string,
};
