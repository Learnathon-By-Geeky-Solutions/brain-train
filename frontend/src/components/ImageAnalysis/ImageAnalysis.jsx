import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Container,
  Separator,
  Flex,
  Heading,
  Image,
  Progress,
  SimpleGrid,
  Spinner,
  Stack,
  Tabs,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Toaster, toaster } from '../ui/toaster';
import { useColorModeValue } from '../ui/color-mode';
import { LuCamera, LuCheck, LuCircleAlert, LuInfo, LuLeaf, LuUpload } from 'react-icons/lu';

// Mock API function to simulate image upload with progress
const uploadImageWithProgress = (file, onProgress) => {
  return new Promise((resolve) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      onProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        
        // Mock response data for the image analysis
        setTimeout(() => {
          resolve({
            success: true,
            imageData: {
              foodName: "Grilled Salmon with Vegetables",
              ingredients: [
                { name: "Salmon", confidence: 0.98 },
                { name: "Broccoli", confidence: 0.95 },
                { name: "Bell Peppers", confidence: 0.92 },
                { name: "Olive Oil", confidence: 0.85 },
                { name: "Lemon", confidence: 0.82 }
              ],
              nutritionFacts: {
                calories: 320,
                protein: 34,
                carbs: 12,
                fat: 16,
                fiber: 4
              },
              healthScore: 87,
              preparationMethod: "Grilled",
              cuisineOrigin: "Mediterranean"
            }
          });
        }, 500);
      }
    }, 100);
  });
};

// Component for displaying nutrients
const NutritionCard = ({ label, value, unit }) => {
  const bgColor = useColorModeValue('gray.50', 'gray.700');
  
  return (
    <Box p={4} bg={bgColor} borderRadius="lg" textAlign="center" boxShadow="sm">
      <Text fontWeight="bold" fontSize="xl">{value}{unit}</Text>
      <Text color="gray.500" fontSize="sm">{label}</Text>
    </Box>
  );
};

// Component for displaying ingredients with confidence score
const IngredientItem = ({ name, confidence }) => {
  const confidencePercent = Math.round(confidence * 100);
  const confidenceColor = 
    confidencePercent > 90 ? "green.500" : 
    confidencePercent > 70 ? "blue.500" : 
    confidencePercent > 50 ? "orange.500" : "red.500";
    
  return (
    <Flex 
      justifyContent="space-between" 
      alignItems="center" 
      p={2} 
      borderBottom="1px" 
      borderColor="gray.200"
    >
      <Text>{name}</Text>
      <Text color={confidenceColor} fontWeight="bold">{confidencePercent}%</Text>
    </Flex>
  );
};

const FoodImageAnalysis = () => {
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef(null);
  
  const backgroundColor = useColorModeValue("gray.50", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check if the file is an image
      if (!selectedFile.type.match('image.*')) {
        toaster.create({
          title: "Invalid file type",
          description: "Please upload an image file (JPEG, PNG, etc.)",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      
      // Check if the file size is below 5MB
      if (selectedFile.size > 5 * 1024 * 1024) {
        toaster.create({
          title: "File too large",
          description: "Please upload an image smaller than 5MB",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      
      setFile(selectedFile);
      
      // Create image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Upload the image and track progress
      const result = await uploadImageWithProgress(file, (progress) => {
        setUploadProgress(progress);
      });
      
      if (result.success) {
        setIsAnalyzing(true);
        
        // After upload is complete, simulate analysis
        setAnalysisResult(result.imageData);
        
        toaster.create({
          title: "Analysis complete",
          description: "Your food image has been successfully analyzed!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toaster.create({
        title: "Upload failed",
        description: error.message || "There was an error uploading your image",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsUploading(false);
      setIsAnalyzing(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const resetComponent = () => {
    setFile(null);
    setImagePreview(null);
    setUploadProgress(0);
    setAnalysisResult(null);
    setIsUploading(false);
    setIsAnalyzing(false);
  };

  return (
    <Container maxW="container.md" pb={8} top="8">
      <VStack spacing={6} align="stretch">
        <Box textAlign="center">
          <Heading as="h1" size="lg" mb={2}>Food Image Analysis</Heading>
          <Text color="gray.500">Upload a food photo to discover its ingredients and nutritional information</Text>
        </Box>
        
        <Separator />
        
        {!analysisResult ? (
          <Box 
            p={6} 
            borderRadius="lg" 
            borderWidth="1px" 
            borderStyle="dashed" 
            borderColor={borderColor}
            bg={backgroundColor}
            textAlign="center"
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              style={{ display: 'none' }}
            />
            
            {!imagePreview ? (
              <VStack spacing={4}>
                <Box 
                  w="100px" 
                  h="100px" 
                  borderRadius="full" 
                  bg="gray.100" 
                  display="flex" 
                  alignItems="center" 
                  justifyContent="center"
                  mx="auto"
                >
                  <LuCamera size={40} color="gray" />
                </Box>
                <Text>Drag and drop your food image here or</Text>
                <Button  
                  colorScheme="teal" 
                  onClick={triggerFileInput}
                >
                  <LuUpload size={16} />
                  Browse files
                </Button>
              </VStack>
            ) : (
              <VStack spacing={4}>
                <Box position="relative" maxW="300px" mx="auto">
                  <Image 
                    src={imagePreview} 
                    alt="Food preview" 
                    borderRadius="md" 
                    objectFit="cover"
                    maxH="250px"
                  />
                </Box>
                <Text fontWeight="medium">{file.name}</Text>
                
                {isUploading ? (
                  <Box w="100%">
                    <Progress.Root size="lg" value={uploadProgress}>
                        <Progress.Track>
                        <Progress.Range />
                        </Progress.Track>
                    </Progress.Root>
                    <Text fontSize="sm" color="gray.500">
                      Uploading... {uploadProgress}%
                    </Text>
                  </Box>
                ) : (
                  <Stack direction="row" spacing={4}>
                    <Button 
                      colorScheme="teal" 
                      onClick={handleUpload}
                    >
                      Analyze Food
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={resetComponent}
                    >
                      Cancel
                    </Button>
                  </Stack>
                )}
              </VStack>
            )}
          </Box>
        ) : (
          <Box>
            <Flex 
              direction={{ base: "column", md: "row" }}
              gap={6}
              mb={6}
            >
              <Box 
                flex="1" 
                borderRadius="lg" 
                overflow="hidden"
                boxShadow="md"
                maxW={{ base: "100%", md: "250px" }}
              >
                <Image 
                  src={imagePreview} 
                  alt="Analyzed food" 
                  w="100%" 
                  objectFit="cover"
                />
              </Box>
              
              <Box flex="2">
                <Heading as="h2" size="md" mb={2}>
                  {analysisResult.foodName}
                </Heading>
                
                <Flex align="center" my={3}>
                  <Box 
                    borderRadius="full" 
                    bg="green.100" 
                    color="green.700" 
                    p={2} 
                    mr={3}
                  >
                    <LuCheck size={18} />
                  </Box>
                  <Text fontSize="lg" fontWeight="medium" color="green.700">
                    {analysisResult.healthScore}/100 Health Score
                  </Text>
                </Flex>
                
                <Text mb={2}>
                  <Text as="span" fontWeight="bold">Preparation: </Text>
                  {analysisResult.preparationMethod}
                </Text>
                
                <Text>
                  <Text as="span" fontWeight="bold">Cuisine: </Text>
                  {analysisResult.cuisineOrigin}
                </Text>
                
                <Button 
                  colorScheme="blue" 
                  mt={4} 
                  size="sm"
                  onClick={resetComponent}
                >
                  Analyze Another Image
                </Button>
              </Box>
            </Flex>
            
            <Tabs.Root colorScheme="teal" variant="enclosed">
              <Tabs.List>
                <Tabs.Trigger value='nutrition'><Box mr={2}><LuInfo size={16} /></Box> Nutrition Facts</Tabs.Trigger>
                <Tabs.Trigger value='ingredient'><Box mr={2}><LuLeaf size={16} /></Box> Ingredients</Tabs.Trigger>
              </Tabs.List>
              
                {/* Nutrition Tab */}
                <Tabs.Content value='nutrition'>
                  <SimpleGrid columns={{ base: 2, md: 5 }} spacing={4} mt={4}>
                    <NutritionCard 
                      label="Calories" 
                      value={analysisResult.nutritionFacts.calories} 
                      unit="kcal" 
                    />
                    <NutritionCard 
                      label="Protein" 
                      value={analysisResult.nutritionFacts.protein} 
                      unit="g"
                    />
                    <NutritionCard 
                      label="Carbs" 
                      value={analysisResult.nutritionFacts.carbs} 
                      unit="g"
                    />
                    <NutritionCard 
                      label="Fat" 
                      value={analysisResult.nutritionFacts.fat} 
                      unit="g"
                    />
                    <NutritionCard 
                      label="Fiber" 
                      value={analysisResult.nutritionFacts.fiber} 
                      unit="g"
                    />
                  </SimpleGrid>
                  
                  <Box mt={6} p={4} bg="blue.50" borderRadius="md">
                    <Flex align="center" mb={2}>
                      <LuCircleAlert size={18} color="blue" style={{ marginRight: '8px' }} />
                      <Text fontWeight="bold" color="blue.700">Important Note</Text>
                    </Flex>
                    <Text fontSize="sm" color="blue.700">
                      Nutritional information is estimated based on image analysis and may vary.
                      For precise dietary information, please consult nutrition labels or a dietary professional.
                    </Text>
                  </Box>
                </Tabs.Content>
                
                {/* Ingredients Tab */}
                <Tabs.Content value='ingredient'>
                  <Box borderWidth="1px" borderRadius="md" overflow="hidden" mt={4}>
                    <Box bg="gray.50" p={3} borderBottomWidth="1px">
                      <Flex justify="space-between">
                        <Text fontWeight="bold">Ingredient</Text>
                        <Text fontWeight="bold">Confidence</Text>
                      </Flex>
                    </Box>
                    <Box>
                      {analysisResult.ingredients.map((ingredient, index) => (
                        <IngredientItem
                          key={index}
                          name={ingredient.name}
                          confidence={ingredient.confidence}
                        />
                      ))}
                    </Box>
                  </Box>
                  
                  <Box mt={6} p={4} bg="blue.50" borderRadius="md">
                    <Flex align="center" mb={2}>
                      <LuCircleAlert size={18} color="blue" style={{ marginRight: '8px' }} />
                      <Text fontWeight="bold" color="blue.700">Ingredient Detection</Text>
                    </Flex>
                    <Text fontSize="sm" color="blue.700">
                      Ingredients are detected using computer vision and may not capture all components,
                      especially spices and smaller ingredients. Higher confidence percentages indicate 
                      more reliable detection.
                    </Text>
                  </Box>
                </Tabs.Content>
            </Tabs.Root>
          </Box>
        )}
      </VStack>
      <Toaster />
    </Container>
  );
};

export default FoodImageAnalysis;