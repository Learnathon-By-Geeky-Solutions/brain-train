import { Box, Text, Flex, Image, useBreakpointValue } from '@chakra-ui/react';
import english_cuisine from '@/assets/english_cuisine.jpg';
import italian_cuisine from '@/assets/italian_cuisine.jpg';
import french_cuisine from '@/assets/french_cuisine.jpg';
import arabic_cuisine from '@/assets/arabic_cuisine.jpg';
import indian_cuisine from '@/assets/indian_cuisine.jpg';

// Usage example:
const cuisines = [
  { name: "italian", imageUrl: italian_cuisine },
  { name: "french", imageUrl: french_cuisine },
  { name: "arabic", imageUrl: arabic_cuisine },
  { name: "english", imageUrl: english_cuisine },
  { name: "indian", imageUrl: indian_cuisine },
];

const ExploreCuisine = ({showResults}) => {
  // Responsive settings
  const imageSize = useBreakpointValue({ base: '150px', md: '200px', lg: '250px' });
  const spacing = useBreakpointValue({ base: 2, md: 4, lg: 6 });
  
  // Function to capitalize the first letter of each word
  const capitalizeWords = (str) => {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Flex
    overflowX="auto"
    gap={spacing}
    p={4}
    css={{
        "&::-webkit-scrollbar": {
            display: "none", 
        },
        "-ms-overflow-style": "none",
        "scrollbar-width": "none", 
    }}
    >
    {cuisines.map((cuisine, index) => (
    <Box 
      key={index} 
      position="relative" 
      minW={imageSize} 
      h={imageSize} 
      borderRadius="lg" 
      overflow="hidden"
      transition="transform 0.3s ease"
      _hover={{ 
          transform: 'scale(1.05)',
          cursor: 'pointer'
      }}
      onClick={() => {
         showResults({type:'cuisine', cuisine: cuisine.name});
      }}
    >
        <Image
            src={cuisine.imageUrl}
            alt={cuisine.name}
            w="100%"
            h="100%"
            objectFit="cover"
        />
        <Box
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            bg="rgba(0, 0, 0, 0.6)"
            p={3}
            backdropFilter="blur(3px)"
        >
            <Text
            color="white"
            fontWeight="bold"
            fontSize={{ base: "sm", md: "md" }}
            textAlign="center"
            >
            {capitalizeWords(cuisine.name)}
            </Text>
        </Box>
    </Box>
    ))}
    </Flex>
  );
};

export default ExploreCuisine;

