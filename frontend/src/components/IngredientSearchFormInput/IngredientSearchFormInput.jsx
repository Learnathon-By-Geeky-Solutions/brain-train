import React, { forwardRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Input, Flex, IconButton, VStack } from '@chakra-ui/react';
import { MdAdd, MdArrowBack } from 'react-icons/md';
import { Field } from '../ui/field';
import { LuDelete } from 'react-icons/lu';
import SuggestionContainer from '../SuggestionContainer/SuggestionContainer';


const IngredientSearchFormInput = forwardRef(({prevState, controller, containerClosed, setContainerClosed}, ref)=> {
  const { setValue, handleSubmit, formState: {errors}, control } = useForm({
    defaultValues: {
      fields: [{ name: '', amount: '', unit: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'fields',              
  });

  const onSubmit = (data) => {
    console.log(data);
    const submitData = {type: 'ingredients', data: data};
    controller(submitData);
  };

  const [amountStates, setAmountStates] = useState([{amount: 0}]);
  const [ingredients, setIngredients] = useState([""]);
  const [keyHandlerForSuggestion, setKeyHandlerForSuggestion] = useState(null);

  const handleIngredientChange = (index, value) => {
    if ((value === "default") && (index === "default")) {
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
    <Flex direction="column">
      <form ref={ref} onSubmit={handleSubmit(onSubmit)} style={{"padding":"5px","border-radius":"15px", "background-color":"var(--text-input)"}}>
        <VStack alignItems="center" margin="none" maxWidth="450px">
          {fields.map((field, index) => (
            <Flex key={field.id} minHeight="16" minWidth="70%" direction="row" alignItems="center" backgroundColor="var(--dark-light-text-input1)" padding="5px" borderRadius="2xl">
              <Flex direction="row" alignItems="center">
                <Field w="100" invalid={errors.fields?.[index]?.name} errorText={(errors.fields?.[index]?.name) ? errors.fields?.[index]?.name.message : "An error occured"} >
                      <Controller
                      name={`fields.${index}.name`}
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Ingredient name"
                          background="none"
                          variant="flushed"
                          color="white"
                          fontSize="md"
                          fontWeight="medium"
                          defaultValue={ingredients[index]}
                          _focus={{ border: "none", boxShadow: "none" }}
                          onChange={(e) => {
                            handleIngredientChange(index, e.target.value);
                            setValue(`fields.${index}.name`, e.target.value); // update form value
                          }}
                          onKeyDown={(e) => setKeyHandlerForSuggestion(e) }
                        />
                      )}
                    />
                    <SuggestionContainer type="ingredients" 
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
              <IconButton marginLeft="auto" 
                  aria-label="Delete field"
                  variant="solid"
                  borderRadius="lg"
                  size="sm"
                  onClick={() => {
                      remove(index);
                      const newStates = [...amountStates];
                      newStates.splice(index, 1);
                      setAmountStates(newStates);
                  }}>
                  <LuDelete />
              </IconButton>
            </Flex>
          ))}
        </VStack>
        <Flex direction="row" alignItems="center" width="100%" marginTop="10px">
          <IconButton size="sm" borderRadius="lg" onClick={()=>{
            prevState();
          }}>
              <MdArrowBack />
          </IconButton>
          <IconButton size="sm" borderRadius="lg" marginLeft="auto" 
            onClick={() => {
              append({ name: '', amount: '', unit: ''});
              handleIngredientChange("default", "default");
            }}>
            <MdAdd />
          </IconButton>
        </Flex>
      </form>
    </Flex>
  );
});
IngredientSearchFormInput.propTypes = {
  prevState: PropTypes.func.isRequired,
  controller: PropTypes.func.isRequired,
  setContainerClosed: PropTypes.func.isRequired,
  containerClosed: PropTypes.bool.isRequired,
};

export default IngredientSearchFormInput;