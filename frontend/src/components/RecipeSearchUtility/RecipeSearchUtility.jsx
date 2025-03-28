import { Flex } from "@chakra-ui/react";
import PropTypes from "prop-types";
import IngredientSearchForm from "@/components/IngredientSearchFormInput/IngredientSearchFormInput";

import "./RecipeSearchUtility.css";
import CentralSearchFrame from "@/components/CentralSearchFrame/CentralSearchFrame";
import TitleSearchInput from "@/components/TitleSearchInput/TitleSearchInput";

export default function RecipeSearchUtility({
  pageState,
  setPageState,
  pageLocation,
  showResults,
  setSearchParams,
  filters,
  setShowSecondBar,
  showSecondBar,
}) {
  function changePageState(newState) {
    setSearchParams({});
    setPageState(newState);
  }

  return (
    <Flex
      direction="column"
      width="100%"
      minHeight="16"
      alignItems="center"
      mb="6"
    >
      {(pageState === "init" || !showSecondBar) &&
        pageLocation === "dashboard" && (
          <Flex
            direction="row"
            h="100%"
            gap={2}
            onClick={() => setShowSecondBar(true)}
          >
            <CentralSearchFrame
              feature={TitleSearchInput}
              featureProps={{ handleSuggestionClick: null }}
              filters={filters}
              showResults={showResults}
            />
            {/* <FilterController 
              addFilter={addFilter} 
              clearFilters={clearFilters}
            /> */}
          </Flex>
        )}

      {pageState === "ingSearch" &&
        pageLocation === "dashboard" &&
        showSecondBar && (
          <CentralSearchFrame
            feature={IngredientSearchForm}
            featureProps={{
              prevState: () => {
                changePageState("init");
              },
              ref: null,
            }}
            filters={filters}
            showResults={showResults}
          />
        )}
    </Flex>
  );
}

RecipeSearchUtility.propTypes = {
  pageState: PropTypes.string.isRequired,
  setPageState: PropTypes.func.isRequired,
  pageLocation: PropTypes.string.isRequired,
  showResults: PropTypes.func.isRequired,
  setSearchParams: PropTypes.func.isRequired,
  filters: PropTypes.array.isRequired,
  showSecondBar: PropTypes.bool.isRequired,
  setShowSecondBar: PropTypes.func.isRequired,
};
