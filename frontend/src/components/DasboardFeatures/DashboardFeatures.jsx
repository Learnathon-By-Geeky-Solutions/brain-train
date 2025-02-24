import { Tabs } from "@chakra-ui/react"
import PropTypes from 'prop-types';
import { LuClipboard, LuHandHeart, LuUtensils } from "react-icons/lu"
import RecipeSearchUtility from "../RecipeSearchUtility/RecipeSearchUtility"

const DashboardFeatures = ({ pageState, pageLocation, setPageState, showResults }) => {
  return (
    <Tabs.Root defaultValue="searchUtility" padding="2" size="lg">
      <Tabs.List>
        <Tabs.Trigger value="searchUtility">
          <LuUtensils />
          Recipes
        </Tabs.Trigger>
        <Tabs.Trigger value="mealPlan">
          <LuClipboard />
          Meal Plan
        </Tabs.Trigger>
        <Tabs.Trigger value="nutrition">
          <LuHandHeart />
          Nutrition
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="searchUtility">
        {
          <RecipeSearchUtility
            pageState={pageState}
            setPageState={setPageState}
            pageLocation={pageLocation}
            showResults={showResults}
          />
        }
      </Tabs.Content>
      <Tabs.Content value="mealPlan">Meal Planning Part</Tabs.Content>
      <Tabs.Content value="nutrition">
        Nutrition & calorie tracking
      </Tabs.Content>
    </Tabs.Root>
  )
}
DashboardFeatures.propTypes = {
  pageState: PropTypes.object.isRequired,
  pageLocation: PropTypes.string.isRequired,
  setPageState: PropTypes.func.isRequired,
  showResults: PropTypes.bool.isRequired,
};

export default DashboardFeatures
