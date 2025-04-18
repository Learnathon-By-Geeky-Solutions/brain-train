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

import { useState } from "react";
import PropTypes from 'prop-types';
import { FaSliders } from 'react-icons/fa6';
import { MdClose } from "react-icons/md";

  
  const FilterController = ({addFilter, clearFilters}) => {
    const rangeFilterTypes = ["Carbs", "Protein", "Fat", "Calories"];

    const [cuisine, setCuisine] = useState("");
    const [dietFiltersToggled, setDietFiltersToggled] = useState([false, false, false, false]);
    const [dietFilters, setDietFilters] = useState([]);
    const [rangeFilters, setRangeFilters] = useState(
      rangeFilterTypes.map((type) => ({type: type, min: 0, max: 100}))
    );
    const [isRangeFiltersActive, setIsRangeFiltersActive] = useState([false, false, false, false]);
    const [filtersApplied, setFiltersApplied] = useState(false);

    function clearFiltersWithState(){
      setCuisine("");
      setDietFiltersToggled([false, false, false, false]);
      setDietFilters([]);
      setRangeFilters(
        rangeFilterTypes.map((type) => ({type: type, min: 0, max: 100}))
      );
      setIsRangeFiltersActive([false, false, false, false]);
      setFiltersApplied(false);
      clearFilters();
    }

    function toggleDietFilter(index,filter){
      const newDietFiltersToggled = [...dietFiltersToggled];
      newDietFiltersToggled[index] = !newDietFiltersToggled[index];
      setDietFiltersToggled(newDietFiltersToggled);

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

    function addRangeFilter(type,min,max){
      const newRangeFilters = [...rangeFilters];
      const filter = newRangeFilters.find((f) => f.type === type);
      filter.min = min;
      filter.max = max;
      setRangeFilters(newRangeFilters);
    }

    function getRangeFilter(type){
      const filter = rangeFilters.find((f) => f.type === type);
      return [filter.min, filter.max];
    }

    function toggleRangeFilter(index){
      const newIsRangeFiltersActive = [...isRangeFiltersActive];
      newIsRangeFiltersActive[index] = !newIsRangeFiltersActive[index];
      setIsRangeFiltersActive(newIsRangeFiltersActive);
    }

    return (
      <HStack wrap="wrap" gap="4">
        <Dialog.Root
          key="center"
          placement="center"
          motionPreset="slide-in-bottom"
        >
          <Dialog.Trigger asChild>
            <IconButton borderRadius="3xl" padding="2" 
              variant="subtle" h="100%"
              borderColor={filtersApplied ? "Highlight" : "none"}
              borderWidth="3"
            >
              <Icon size="sm">
              <FaSliders  />
              </Icon>
              Filter
            </IconButton>
          </Dialog.Trigger>
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content>
                <Dialog.Header>
                  <HStack placeContent="center">
                    <Dialog.Title textAlign="center">Filters</Dialog.Title>
                    <Dialog.CloseTrigger asChild position="absolute" right="0" top="0.5">
                      <IconButton variant="ghost"><MdClose/></IconButton>
                    </Dialog.CloseTrigger>
                  </HStack>
                </Dialog.Header>
                <Dialog.Body>
                  <Flex direction="column" gap="4" w="100%">
                  <div>
                    <Text fontSize="lg" fontWeight="semibold">
                      Cuisine
                    </Text>
                    <Input placeholder="Example: British, Italian, Chineese" 
                      value={cuisine}
                      onChange={(e)=>{
                        setCuisine(e.target.value);
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
                    {["Vegan", "Vegetarian", "Gluten Free", "Dairy Free"].map((diet,index) => (
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
                            value={getRangeFilter(type).map((v)=> v / (type === "Calories" ? 100 : 1))}
                            onValueChange={(e)=>{
                              const multiplyingFactor = (type === "Calories") ? 100 : 1;
                              addRangeFilter(type,e.value[0]*multiplyingFactor,e.value[1]*multiplyingFactor);
                            }}
                            w="100%"
                            px="2"
                          >
                          <Slider.Control>
                            <Slider.Track>
                              <Slider.Range />
                            </Slider.Track>
                            <Slider.Thumb index={0}>
                              <Slider.HiddenInput />
                            </Slider.Thumb>
                            <Slider.Thumb index={1}>
                              <Slider.HiddenInput />
                            </Slider.Thumb>
                          </Slider.Control>
                         <Flex direction="row" mt="2" justifyContent="space-between">
                            {["Minimum", "Maximum"].map((label,index) => (
                              <Flex mx="2" key={label}>
                                <Flex direction="column" 
                                  w={type === "Calories" ? "36" : "20"}
                                  key={label}
                                  alignItems="center"
                                >
                                  <Text 
                                    fontSize="sm"
                                  >
                                    {label}
                                  </Text>
                                  <Input
                                    value={getRangeFilter(type)[index]}
                                    onChange={(e)=>{
                                      const value = getRangeFilter(type);
                                      value[index] = e.target.value;
                                      addRangeFilter(type,value[0],value[1]);
                                    }}
                                    bgColor={"var(--text-input)"}
                                    borderRadius="3xl"
                                    color="var(--text)"
                                    w="90%"
                                    textAlign="center"
                                  />
                                </Flex>
                                <Text 
                                  fontSize="sm"
                                  alignSelf="center"
                                  justifySelf="center"
                                  mt="4"
                                >
                                  {type === "Calories" ? "cal" : "g"}
                                </Text>
                              </Flex>
                              ))
                            }
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
                  <Dialog.ActionTrigger>
                    <Button 
                      variant="outline"
                      onClick={()=>{
                        clearFiltersWithState();
                      }}
                      mr="1"
                    >
                      Clear
                    </Button>
                  {/* </Dialog.ActionTrigger> */}
                  <Button
                    onClick={()=>{
                      console.log(isRangeFiltersActive);
                      setFiltersApplied(true);
                      let activeRangeFilters = [];
                      for (let i = 0; i < isRangeFiltersActive.length; i++) {
                        if(isRangeFiltersActive[i]){
                          activeRangeFilters.push(rangeFilters[i]);
                        }
                      }
                      addFilter(
                        [{cuisine: cuisine},
                         {diet: dietFilters},
                         {rangeFilters: activeRangeFilters}
                        ]
                      );
                    }}
                  >
                    Apply
                  </Button>
                  </Dialog.ActionTrigger>
                </Dialog.Footer>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>
      </HStack>
    )
  }
FilterController.propTypes = {
  addFilter: PropTypes.func.isRequired,
  clearFilters: PropTypes.func.isRequired,
};

export default FilterController;
