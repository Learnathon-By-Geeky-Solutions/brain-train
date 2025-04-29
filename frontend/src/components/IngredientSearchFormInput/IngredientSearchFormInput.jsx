import React, { forwardRef, useState } from "react";
import PropTypes from "prop-types";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import {
  Input,
  Flex,
  IconButton,
  VStack,
  Separator,
  InputGroup,
  Text,
} from "@chakra-ui/react";
import { MdAdd, MdArrowBack } from "react-icons/md";
import { Field } from "../ui/field";
import { LuDelete } from "react-icons/lu";
import SuggestionContainer from "../SuggestionContainer/SuggestionContainer";
import { useColorModeValue } from "../ui/color-mode";

const IngredientSearchFormInput = forwardRef(
  ({ prevState, controller, containerClosed, setContainerClosed }, ref) => {
    const {
      setValue,
      handleSubmit,
      formState: { errors },
      control,
    } = useForm({
      defaultValues: {
        fields: [{ name: "", amount: "", unit: "" }],
      },
    });

    const { fields, append, remove } = useFieldArray({
      control,
      name: "fields",
    });

    const onSubmit = (data) => {
      const submitData = { type: "ingredients", data: data };
      controller(submitData);
    };

    const [amountStates, setAmountStates] = useState([{ amount: 0 }]);
    const [ingredients, setIngredients] = useState([""]);
    const [keyHandlerForSuggestion, setKeyHandlerForSuggestion] =
      useState(null);
    const bg1 = useColorModeValue(
      "var(--light-ing-input-bg)",
      "var(--text-input)",
    );
    const bg2 = useColorModeValue(
      "whiteAlpha.800",
      "var(--dark-light-text-input1)",
    );
    const textColor = useColorModeValue("black", "white");

    const handleIngredientChange = (index, value) => {
      if (value === "default" && index === "default") {
        setIngredients((prev) => [...prev, ""]);
        return;
      }
      setIngredients((prev) => {
        const newIngredients = [...prev];
        newIngredients[index] = value; // Update specific ingredient
        return newIngredients;
      });
    };

    return (
      <Flex direction="column" maxWidth="450px">
        <form
          ref={ref}
          onSubmit={handleSubmit(onSubmit)}
          style={{
            "border-radius": "15px",
            "background-color": "none",
            background: "none",
            padding: "3px",
          }}
        >
          <VStack
            alignItems="center"
            margin="none"
            p="2"
            borderRadius="15px"
            bgColor={bg1}
          >
            {fields.map((field, index) => (
              <Flex
                key={field.id}
                minHeight="16"
                minWidth="70%"
                direction="row"
                alignItems="center"
                backgroundColor={bg2}
                borderRadius="2xl"
              >
                <Flex direction="row" alignItems="center">
                  <Field
                    w="100"
                    invalid={errors.fields?.[index]?.name}
                    errorText={
                      errors.fields?.[index]?.name
                        ? errors.fields?.[index]?.name.message
                        : "An error occured"
                    }
                  >
                    <Controller
                      name={`fields.${index}.name`}
                      control={control}
                      render={({ field }) => (
                        <InputGroup
                          endElement={
                            <Text fontSize="xs" color="gray.400" mt={6}>
                              ENTER to finish
                            </Text>
                          }
                        >
                          <Input
                            {...field}
                            placeholder="Ingredient name"
                            background="none"
                            variant="flushed"
                            color={textColor}
                            fontSize="md"
                            fontWeight="medium"
                            defaultValue={ingredients[index]}
                            _focus={{ border: "none", boxShadow: "none" }}
                            onChange={(e) => {
                              handleIngredientChange(index, e.target.value);
                              setValue(`fields.${index}.name`, e.target.value); // update form value
                            }}
                            onKeyDown={(e) => setKeyHandlerForSuggestion(e)}
                          />
                        </InputGroup>
                      )}
                    />
                    <SuggestionContainer
                      type="ingredients"
                      query={ingredients[index]}
                      handleClick={(name) => {
                        handleIngredientChange(index, name);
                        setValue(`fields.${index}.name`, name);
                      }}
                      keyHandler={keyHandlerForSuggestion}
                      containerClosed={containerClosed}
                      setContainerClosed={setContainerClosed}
                    />
                  </Field>
                </Flex>
                <IconButton
                  marginLeft="auto"
                  aria-label="Delete field"
                  variant="ghost"
                  borderLeftRadius="none"
                  borderRightRadius="2xl"
                  h="16"
                  onClick={() => {
                    remove(index);
                    const newStates = [...amountStates];
                    newStates.splice(index, 1);
                    setAmountStates(newStates);
                  }}
                >
                  <LuDelete />
                </IconButton>
              </Flex>
            ))}
          </VStack>
          <Flex direction="row" alignItems="center" width="100%" marginTop="1">
            <IconButton
              size="lg"
              w="50%"
              variant="subtle"
              onClick={() => {
                prevState();
              }}
              borderLeftRadius="2xl"
              borderRightRadius="none"
            >
              <MdArrowBack />
            </IconButton>
            <Separator orientation="vertical" height="auto" />
            <IconButton
              variant="subtle"
              size="lg"
              marginLeft="auto"
              w="50%"
              borderLeftRadius="none"
              borderRightRadius="2xl"
              onClick={() => {
                append({ name: "", amount: "", unit: "" });
                handleIngredientChange("default", "default");
              }}
            >
              <MdAdd />
            </IconButton>
          </Flex>
        </form>
      </Flex>
    );
  },
);

IngredientSearchFormInput.displayName = "IngredientSearchFormInput";

IngredientSearchFormInput.propTypes = {
  prevState: PropTypes.func.isRequired,
  controller: PropTypes.func.isRequired,
  setContainerClosed: PropTypes.func.isRequired,
  containerClosed: PropTypes.bool.isRequired,
};

export default IngredientSearchFormInput;
