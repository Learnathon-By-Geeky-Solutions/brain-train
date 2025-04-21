import { Flex } from "@chakra-ui/react";
import PropTypes from "prop-types";
import IngredientSearchForm from "@/components/IngredientSearchFormInput/IngredientSearchFormInput";

import "./RecipeSearchUtility.css";
import CentralSearchFrame from "@/components/CentralSearchFrame/CentralSearchFrame";
import TitleSearchInput from "@/components/TitleSearchInput/TitleSearchInput";
import { useLocation } from "react-router-dom";

export default function RecipeSearchUtility({
  pageState,
  setPageState,
  showResults,
  filters,
  setShowSecondBar,
  showSecondBar,
  containerClosed,
  setContainerClosed,
}) {
  const location = useLocation();

  return (
    <Flex
      direction="column"
      width="100%"
      minHeight="16"
      alignItems="center"
      mb="6"
    >
      {(pageState === "init" || !showSecondBar) &&
        location.pathname !== "/dashboard/chat" && (
          <Flex
            direction="row"
            h="100%"
            gap={2}
            onClick={() => {
              setShowSecondBar(true);
            }}
          >
            <CentralSearchFrame
              feature={TitleSearchInput}
              featureProps={{
                handleSuggestionClick: null,
                showSecondBar: showSecondBar,
              }}
              filters={filters}
              showResults={showResults}
              containerClosed={containerClosed}
              setContainerClosed={setContainerClosed}
            />
          </Flex>
        )}

      {pageState === "ingSearch" && showSecondBar && (
        <CentralSearchFrame
          feature={IngredientSearchForm}
          featureProps={{
            prevState: () => {
              setPageState("init");
            },
            ref: null,
          }}
          filters={filters}
          showResults={showResults}
          containerClosed={containerClosed}
          setContainerClosed={setContainerClosed}
        />
      )}
    </Flex>
  );
}

RecipeSearchUtility.propTypes = {
  pageState: PropTypes.string.isRequired,
  setPageState: PropTypes.func.isRequired,
  showResults: PropTypes.func.isRequired,
  filters: PropTypes.array.isRequired,
  showSecondBar: PropTypes.bool.isRequired,
  setShowSecondBar: PropTypes.func.isRequired,
  containerClosed: PropTypes.bool.isRequired,
  setContainerClosed: PropTypes.func.isRequired,
};
