import React, { useState } from 'react';
import {
  Box,
  Container,
  Separator,
  Heading,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Toaster } from '../ui/toaster';
import PreAnalysis from './PreAnalysis';
import Analysis from './Analysis';

const FoodImageAnalysis = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalysing, setIsAnalyzing] = useState(false);

  const resetComponent = () => {
    setImagePreview(null);
    setAnalysisResult(null);
  };

  return (
    <Container maxW="container.md" pb={8} top="8">
      <VStack spacing={6} align="stretch">
        <Box textAlign="center" mb="4">
          <Heading size="3xl" mb={2}>Food Image Analysis</Heading>
          <Text color="gray.500">Upload a food photo to discover its ingredients and nutritional information</Text>
        </Box>
        
        <Separator size="lg"/>

        <PreAnalysis 
          show={analysisResult ? false : true} 
          imagePreview={imagePreview} 
          resetComponent={resetComponent}  
          setImagePreview={setImagePreview}
          setAnalysisResult={setAnalysisResult}
          setIsAnalyzing={setIsAnalyzing}
        />
        <Analysis 
          show={analysisResult ? true : false} 
          imagePreview={imagePreview} 
          analysisResult={analysisResult} 
          resetComponent={resetComponent} 
        />
      </VStack>
      <Toaster />
    </Container>
  );
};

export default FoodImageAnalysis;