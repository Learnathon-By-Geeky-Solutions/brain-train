import React, { forwardRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Input, Flex, IconButton, NativeSelectField, NativeSelectRoot, VStack } from '@chakra-ui/react';
import { MdAdd, MdArrowBack, MdScale } from 'react-icons/md';
import { Field } from '../ui/field';
import { LuDelete } from 'react-icons/lu';
import SuggestionContainer from '../SuggestionContainer/SuggestionContainer';


const IngredientSearchFormInput = forwardRef(({prevState, controller}, ref)=> {
  const { register, setValue, handleSubmit, formState: {errors}, control } = useForm({
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


  function updateStates(index){

    const newStates = [...amountStates];

    if(!newStates[index]){
        newStates[index]={amount: 0};
        newStates[index].amount = 1;
    }else{
        newStates[index].amount = 1 - newStates[index].amount;
    } 
    setAmountStates(newStates);

    if( newStates[index].amount == 0 ){
        setValue(`fields.${index}.amount`, '');
        setValue(`fields.${index}.unit`, '');
    }
  }


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
                        />

                    </Field>
                    <IconButton aria-label="Add amount" variant="solid" borderRadius="lg" marginRight="5px" size="sm" onClick={ () => {
                        updateStates(index);
                    }}>
                        <MdScale />
                    </IconButton>
                </Flex>
             {
                amountStates[index] && amountStates[index].amount == 1 && (
                    <Flex direction="row" alignItems="center">
                        <Input
                            placeholder="Amount"
                            w="100px"
                            marginRight="2"
                            variant="flushed"
                            color="white"
                            _focus={{border: "none", boxShadow: "none"}}
                            backgroundColor="var(--dark-light-text-input1)"
                            {...register(`fields.${index}.amount`)}
                        />
                        <NativeSelectRoot w="80px" marginRight="5px">
                            <Field invalid={errors.fields?.[index]?.unit} errorText={(errors.fields?.[index]?.unit) ? errors.fields?.[index]?.unit.message : "An error occured"} >
                                <NativeSelectField textAlign="center" placeholder="Unit"
                                {...register(`fields.${index}.unit`, { required: 'Unit is not specified' })}>
                                    <option value="kg">Kg</option>
                                    <option value="g">gram</option>
                                    <option value="qtty">Quantity</option>
                                    <option value="ml">mL</option>
                                    <option value="l">Litre</option>
                                </NativeSelectField>
                            </Field>
                        </NativeSelectRoot>
                    </Flex>
                )
             }
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
};

export default IngredientSearchFormInput;