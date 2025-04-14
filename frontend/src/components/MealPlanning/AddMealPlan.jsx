import {
    Button,
    Dialog,
    HStack,
    Portal,
    IconButton, Icon,
    Input,
    Text,
    Slider,
    Accordion,
    Flex,
    Switch
  } from "@chakra-ui/react"

import { useState, useRef } from "react";
import PropTypes from 'prop-types';
import { FaSliders } from 'react-icons/fa6';
import { MdClose } from "react-icons/md";
import { LuCirclePlus, LuPlus } from "react-icons/lu";
import { saveMealPlan } from "./api";
import { Toaster, toaster } from '../ui/toaster';
import Demo from "./OverlapDialogBox";

  
  const PlanController = ({startDate,currentDate,toggleReload}) => {
    const rangeFilterTypes = ["Target Calories"];
    const dietFilterTypes = ["Vegan", "Vegetarian", "Gluten Free", "Ketogenic", "Lacto-Vegetarian", "Pescetarian"];
    const timeFrameFilterTypes = ["Day", "Week"];

    const [exclude, setExclude] = useState("");
    const [dietFiltersToggled, setDietFiltersToggled] = useState([false, false, false, false, false, false]);
    const [isWeekly, setIsWeekly] = useState(true);
    const [dietFilters, setDietFilters] = useState([]);
    const [rangeFilters, setRangeFilters] = useState(
      rangeFilterTypes.map((type) => ({type: type, value: 0}))
    );
    const [planName, setPlanName] = useState("");
    const [isRangeFiltersActive, setIsRangeFiltersActive] = useState([false]);
    const [filtersApplied, setFiltersApplied] = useState(false);

    let plan = {name:"",exclude:"",diet:[],timeFrame:"",targetCalories:""};

    function clearFiltersWithState(){
      setExclude("");
      setPlanName("");
      setDietFiltersToggled([false, false, false, false, false, false]);
      setDietFilters([]);
      // setTimeFrameFiltersToggled([false, false]);
      // setTimeFrameFilters([]);
      setIsWeekly(true);
      setRangeFilters(
        rangeFilterTypes.map((type) => ({type: type, value: 0}))
      );
      setIsRangeFiltersActive([false]);
      setFiltersApplied(false);
      plan = {name:"",exclude:"",diet:[],timeFrame:"",targetCalories:""};
      console.log("Meal Plan cleared");
      console.log(plan);
    }

    function toggleDietFilter(index,filter){
      const newDietFiltersToggled = [...dietFiltersToggled];
      newDietFiltersToggled[index] = !newDietFiltersToggled[index];
      setDietFiltersToggled(newDietFiltersToggled);

      filter = filter.toLowerCase();
      if(newDietFiltersToggled[index]){
        const newDietFilters = [...dietFilters];
        newDietFilters.push(filter);
        setDietFilters(newDietFilters);
      }
      else{
        const newDietFilters = [...dietFilters];
        newDietFilters.splice(newDietFilters.findIndex((f) => f === filter), 1);
        setDietFilters(newDietFilters);
      }
    }

    function toggleTimeFrameFilter(filter){
      if(filter === "Day"){
        setIsWeekly(false);
      }
      else{
        setIsWeekly(true);
      }
    }

    function addRangeFilter(type,value){
      const newRangeFilters = [...rangeFilters];
      const filter = newRangeFilters.find((f) => f.type === type);
      filter.value = value;
      setRangeFilters(newRangeFilters);
    }

    function getRangeFilter(type){
      const filter = rangeFilters.find((f) => f.type === type);
      return [filter.value];
    }

    function toggleRangeFilter(index){
      const newIsRangeFiltersActive = [...isRangeFiltersActive];
      newIsRangeFiltersActive[index] = !newIsRangeFiltersActive[index];
      setIsRangeFiltersActive(newIsRangeFiltersActive);
    }

    function handleSaveMealPlan(setVisible,setDailyPlans,setWeeklyPlans,ignoreConflict=false){
      toaster.create({title: "Meal Plan is being saved. Please wait..", type: "loading"});
      setFiltersApplied(true);
      let newPlan = {...plan};

      console.log('value of ignoreConflict');
      console.log(ignoreConflict);

      if(ignoreConflict)
      newPlan.ignoreConflict = true;

      newPlan.exclude = exclude;
      newPlan.name = planName;
      isRangeFiltersActive[0] ? newPlan.targetCalories = rangeFilters[0].value : newPlan.targetCalories = "";
      for( const diet of dietFilters ){
        if( newPlan.diet.indexOf(diet) === -1 ){
          newPlan.diet.push(diet);
        }
      }
      newPlan.timeFrame = isWeekly ? "week" : "day";
      plan = newPlan;
      console.log("Meal Plan updated");
      console.log(plan);
      saveMealPlan(plan,currentDate).then((data) => {
        console.log("Meal Plan saving response");
        console.log(data);
        if(data.status !== 'error') {
          toggleReload();
          toaster.dismiss();
          toaster.create({title: "Meal Plan succesfully saved", type: "success"});

        }
        else if(data.msg == 'overlap'){
          // toaster.create({title: "Meal Plan overlaps", type: "error"});
          toaster.dismiss();
          setVisible(true);
          setDailyPlans(data.res.existingPlans.dailyPlans);
          setWeeklyPlans(data.res.existingPlans.weeklyPlans);
        }
        else{
          toaster.dismiss();
          let toasterTitle = data.msg;
          if(data.msg === 'targetCalories must be a number')
          toasterTitle = "Target Calories must be set";
          toaster.create({title: toasterTitle, type: "error"});
        }
      });
    }

    if( currentDate < startDate ){
      return null;
    }

    return (
      <HStack wrap="wrap" gap="4">
        <Dialog.Root
          key="center"
          placement="center"
          motionPreset="slide-in-bottom"
        >
          <Dialog.Trigger asChild>
            <IconButton borderRadius="full" padding="2" 
              variant="subtle"
              borderColor={filtersApplied ? "Highlight" : "none"}
              borderWidth="3"
            >
              <Icon size="sm">
                <LuCirclePlus/>
              </Icon>
            </IconButton>
          </Dialog.Trigger>
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content>
                <Dialog.Header>
                  <HStack placeContent="center">
                    <Dialog.Title textAlign="center">Meal Plan</Dialog.Title>
                    <Dialog.CloseTrigger asChild position="absolute" right="0" top="0.5">
                      <IconButton variant="ghost"><MdClose/></IconButton>
                    </Dialog.CloseTrigger>
                  </HStack>
                </Dialog.Header>
                <Dialog.Body>
                  <Flex direction="column" gap="4" w="100%">
                  <div>
                    <Text fontSize="lg" fontWeight="semibold">
                      Give a name to your plan
                    </Text>
                    <Input placeholder="Example: My Great Vegeterian week!" 
                      value={planName}
                      onChange={(e)=>{
                        setPlanName(e.target.value);
                      }}
                      bgColor={"var(--text-input)"}
                      borderRadius="3xl"
                      color="var(--text)"
                    />
                  </div>
                  <div>
                    <Text fontSize="lg" fontWeight="semibold">
                      Exclude
                    </Text>
                    <Input placeholder="Example: Shellfish, Olives" 
                      value={exclude}
                      onChange={(e)=>{
                        setExclude(e.target.value.toLowerCase());
                      }}
                      bgColor={"var(--text-input)"}
                      borderRadius="3xl"
                      color="var(--text)"
                    />
                  </div>
                  <div>
                    <Text fontSize="lg" fontWeight="semibold" mb="2">
                      Diet
                    </Text>
                    <Flex wrap="wrap" gap="3">
                    {dietFilterTypes.map((diet,index) => (
                        <Button 
                          variant="outline"
                          onClick={()=>{
                            toggleDietFilter(index,diet);
                          }}
                          bgColor={dietFiltersToggled[index] ? "Highlight" : "none"}
                          borderRadius="3xl"
                          borderWidth="2px"
                          _hover={{
                            borderColor: "Highlight" 
                          }}
                          key={diet}
                        >
                          {diet}
                        </Button>
                      ))
                    }
                    </Flex>
                  </div>
                  <div>
                    <Text fontSize="lg" fontWeight="semibold" mb="2">
                      Time Frame
                    </Text>
                    <Flex wrap="wrap" gap="3">
                    {timeFrameFilterTypes.map((time) => (
                        <Button 
                          variant="outline"
                          onClick={()=>{
                            toggleTimeFrameFilter(time);
                          }}
                          bgColor={isWeekly === ( time === "Week" ) ? "Highlight" : "none"}
                          borderRadius="3xl"
                          borderWidth="2px"
                          _hover={{
                            borderColor: "Highlight" 
                          }}
                          key={time}
                        >
                          {time}
                        </Button>
                      ))
                    }
                    </Flex>
                  </div>
                  <Accordion.Root multiple display="flex" flexDirection="column">
                  {rangeFilterTypes.map((type,index) => (
                    <Accordion.Item key={type} value={index}>
                      <Accordion.ItemTrigger>
                        <Text fontSize="lg" fontWeight="semibold">
                          {type}
                        </Text>
                        <Accordion.ItemIndicator />
                      </Accordion.ItemTrigger>
                      <Accordion.ItemContent>
                        <Accordion.ItemBody>
                        <Flex direction="row" mb="2">
                          <Switch.Root 
                            variant="raised"
                            checked={isRangeFiltersActive[index]}
                            onCheckedChange={()=>
                              toggleRangeFilter(index)
                            }
                          >
                            <Switch.HiddenInput />
                            <Switch.Control>
                              <Switch.Thumb />
                            </Switch.Control>
                            <Switch.Label />
                          </Switch.Root>
                          <Text fontSize="sm">
                            {isRangeFiltersActive[index] ? "Enabled" : "Disabled"}
                          </Text>
                        </Flex>
                        { isRangeFiltersActive[index] && 
                          (<Slider.Root 
                            value={[getRangeFilter(type)[0]/100]}
                            onValueChange={(e)=>{
                              addRangeFilter(type,e.value[0]*100);
                            }}
                            w="100%"
                          >
                          <Slider.Control>
                            <Slider.Track>
                              <Slider.Range />
                            </Slider.Track>
                            <Slider.Thumb index={0}>
                              <Slider.HiddenInput />
                            </Slider.Thumb>
                            {/* <Slider.Thumb index={1}>
                              <Slider.HiddenInput />
                            </Slider.Thumb> */}
                          </Slider.Control>
                         <Flex direction="row" justifyContent="center" mt="2">
                            {/* {["Minimum", "Maximum"].map((label,index) => (
                                <VStack w="1/6" gap="0" p="0" key={label}>
                                  <Text fontSize="sm">
                                    {label}
                                  </Text> */}
                                  <HStack p="0" gap="0">
                                  <Input
                                    value={getRangeFilter(type)}
                                    onChange={(e)=>{
                                      addRangeFilter(type,e.target.value);
                                    }}
                                    bgColor={"var(--text-input)"}
                                    borderRadius="3xl"
                                    color="var(--text)"
                                    w="20"
                                    textAlign="center"
                                    mr="2"
                                  />
                                  <Text fontSize="sm">
                                    kcal
                                  </Text>
                                </HStack>
                                {/* // </VStack>
                              ))
                            } */}
                          </Flex>
                          </Slider.Root>)}
                        </Accordion.ItemBody>
                      </Accordion.ItemContent>
                    </Accordion.Item>
                    ))
                  }
                  </Accordion.Root>
                  </Flex>
                </Dialog.Body>
                <Dialog.Footer>
                  <Dialog.ActionTrigger asChild>
                    <Button 
                      variant="outline"
                      onClick={()=>{
                        clearFiltersWithState();
                      }}
                    >
                      Clear
                    </Button>
                  </Dialog.ActionTrigger>
                  <Dialog.ActionTrigger asChild>
                  <Demo clickFn={handleSaveMealPlan}/>
                  </Dialog.ActionTrigger>
                </Dialog.Footer>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>
        {/* <Toaster /> */}
      </HStack>
    )
  }
// FilterController.propTypes = {
//   addFilter: PropTypes.func.isRequired,
//   clearFilters: PropTypes.func.isRequired,
// };

export default PlanController;
