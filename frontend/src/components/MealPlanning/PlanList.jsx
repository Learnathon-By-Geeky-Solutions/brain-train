import { List, Menu, Portal } from "@chakra-ui/react";

import { useColorModeValue } from "../ui/color-mode";
import { deletePlan } from "./api";
import { toaster } from "../ui/toaster";
import { useSearchParams } from "react-router-dom";

const renderPlanList = (
  planList,
  setIsActiveIdx,
  toggleReload,
  isActivePlanIdx,
  setIsActivePlanIdx,
  planIdxOffset,
  setStartDate = null,
) => {
  const setSearchParams = useSearchParams()[1];
  const activeColor = useColorModeValue("green.700", "teal.700");

  let type = "day";
  if (planList.length > 0) {
    type = planList[0].type;
  }

  return planList.map((plan, index) => (
    <Menu.Root key={plan.startDate}>
      <Menu.ContextTrigger>
        <List.Item
          color={
            isActivePlanIdx === planIdxOffset + index ? activeColor : undefined
          }
          _hover={{ cursor: "pointer" }}
          onClick={() => {
            if (type === "day") {
              setSearchParams({
                time: "day",
                date: plan.startDate,
                idx: -1,
                sIdx: planIdxOffset + index,
              });
            } else {
              setSearchParams({});
              setStartDate(plan.startDate);
            }
            setIsActivePlanIdx(planIdxOffset + index);
            setIsActiveIdx(2);
          }}
        >
          {plan.title}
        </List.Item>
      </Menu.ContextTrigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item
              onClick={() => {
                toaster.create({
                  title: "Deleting plan. Please wait...",
                  type: "loading",
                });
                deletePlan(plan._id, type).then((data) => {
                  if (data.status === "error") {
                    toaster.dismiss();
                    toaster.create({ title: data.msg, type: "error" });
                  } else {
                    toggleReload();
                    toaster.dismiss();
                    toaster.create({
                      title: "Plan deleted successfully",
                      type: "success",
                    });
                  }
                });
              }}
            >
              Delete
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  ));
};

export { renderPlanList };
