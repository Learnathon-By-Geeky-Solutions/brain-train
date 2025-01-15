import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Button, Input, Flex, IconButton, NativeSelectField, NativeSelectRoot } from '@chakra-ui/react';
import { MdScale } from 'react-icons/md';
import { Field } from '../ui/field';
import { LuDelete } from 'react-icons/lu';


export default function DynamicFormInput({prevState}) {
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
  };

  const [amountStates, setStates] = useState([{amount: 0}]);

  function updateStates(index){

    const newStates = [...amountStates];

    if(!newStates[index]){
        newStates[index]={amount: 0};
        newStates[index].amount = 1;
    }else{
        newStates[index].amount = 1 - newStates[index].amount;
    } 
    setStates(newStates);

    if( newStates[index].amount == 0 ){
        setValue(`fields.${index}.amount`, '');
        setValue(`fields.${index}.unit`, '');
    }
  }


  return (
    <Flex direction="column">
      <form onSubmit={handleSubmit(onSubmit)} style={{"padding":"5px"}}>
        <Flex direction="column" alignItems="center" margin="none">
          {fields.map((field, index) => (
            <Flex key={field.id} h="16" direction="row" alignItems="center" backgroundColor="gray.100" padding="5px" w="100%">
                <Flex direction="row" alignItems="center">
                    <Field w="100" invalid={errors.fields?.[index]?.name} errorText={(errors.fields?.[index]?.name) ? errors.fields?.[index]?.name.message : "An error occured"} >
                        <Input
                            placeholder="Ingredient name"
                            background="none"
                            variant="flushed"
                            _focus={{border: "none", boxShadow: "none"}}
                            {...register(`fields.${index}.name`, { required: "Ingredient name is required" }) }
                        />
                    </Field>
                    <IconButton aria-label="Add amount" variant="solid" borderRadius="full" size="sm" onClick={ () => {
                        updateStates(index, 'amount');
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
                            {...register(`fields.${index}.amount`)}
                        />
                        <NativeSelectRoot w="80px">
                            <Field invalid={errors.fields?.[index]?.unit} errorText={(errors.fields?.[index]?.unit) ? errors.fields?.[index]?.unit.message : "An error occured"} >
                                <NativeSelectField textAlign="center" placeholder="Unit" color="black"
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
                borderRadius="full"
                size="sm"
                onClick={() => {
                    remove(index);
                    const newStates = [...amountStates];
                    newStates.splice(index, 1);
                    setStates(newStates);
                }}>
                <LuDelete color='black' />
           </IconButton>
            </Flex>
          ))}
        </Flex>
        <Button colorScheme="teal" onClick={() => append({ name: '', amount: '', unit: ''})}>
            Add Ingredient
          </Button>
        <Button type="submit" colorScheme="blue" mt={4}>
          Search
        </Button>
        <Button type="reset" colorScheme="red" mt={4} onClick={()=>{
          console.log('resetting');
          prevState();
        }}>
            Reset
        </Button>
      </form>
    </Flex>
  );
};