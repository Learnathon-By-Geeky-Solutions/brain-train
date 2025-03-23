import {
    Button,
    Dialog,
    HStack,
    Portal,
    IconButton, Icon,
    Input,
    Text,
    Slider,
    VStack,
    Accordion,
    Flex,
    Switch
  } from "@chakra-ui/react"

import { useState } from "react";
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
            <IconButton bgColor="var(--text-input)" borderRadius="3xl" padding="2" mt="6" alignSelf="center" variant="ghost">
              <Icon>
              <FaSliders />
              </Icon>
              Advanced Filter
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
                    {["Vegan", "Vegetarian", "Gluten Free", "Lacto Vegetarian", "Ketogenic"].map((diet,index) => (
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
                        >
                          {diet}
                        </Button>
                      ))
                    }
                    </Flex>
                  </div>
                  <Accordion.Root multiple display="flex" flexDirection="column">
                  {rangeFilterTypes.map((type,index) => (
                    <Accordion.Item key={index} value={index}>
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
                            value={getRangeFilter(type)}
                            onValueChange={(e)=>{
                              addRangeFilter(type,e.value[0],e.value[1]);
                            }}
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
                         <Flex direction="row" justifyContent="space-between" mt="2">
                            {["Minimum", "Maximum"].map((label,index) => (
                                <VStack w="1/6" gap="0">
                                  <Text fontSize="sm">
                                    {label}
                                  </Text>
                                  <Input
                                    value={`${getRangeFilter(type)[index]}${(type === "Calories") ? " cal" : " g"}`}
                                    onChange={(e)=>{
                                      const value = getRangeFilter(type);
                                      value[index] = e.target.value;
                                      addRangeFilter(type,value[0],value[1]);
                                    }}
                                    bgColor={"var(--text-input)"}
                                    borderRadius="3xl"
                                    color="var(--text)"
                                    textAlign="center"
                                  />
                                </VStack>
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
                  <Dialog.ActionTrigger asChild>
                    <Button 
                      variant="outline"
                      onClick={()=>{
                        clearFilters();
                      }}
                    >
                      Clear
                    </Button>
                  </Dialog.ActionTrigger>
                  <Button
                    onClick={()=>{
                      console.log(isRangeFiltersActive);
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
                </Dialog.Footer>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>
      </HStack>
    )
  }

export default FilterController;
