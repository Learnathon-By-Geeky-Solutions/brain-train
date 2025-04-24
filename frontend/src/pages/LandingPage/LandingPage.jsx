import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Flex,
  Text,
  Heading,
  Button,
  Image,
  Stack,
  SimpleGrid,
  Link,
  Icon,
  AspectRatio,
  Input,
  InputGroup,
  Separator,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import {
  Search,
  Heart,
  Globe,
  Calendar,
  Camera,
  CheckCircle,
  ChevronRight,
} from "lucide-react";
import { LuFacebook, LuInstagram, LuLinkedin, LuTwitter } from "react-icons/lu";
import video from "../../assets/bg-video.mp4";
import app from "../../assets/app.png";
import AIFeatureCard from "./AIFeatureCard";
import SectionTitle from "./SectionTitle";
import TestimonialCard from "./TestimonialCard";
import FeatureCard from "./FeatureCard";

import PropTypes from "prop-types";

// Motion components
const MotionBox = motion(Box);
const MotionImage = motion(Image);
const MotionHeading = motion(Heading);
const MotionText = motion(Text);

// Main component
export default function GeekyChefLanding({ openAuthModal }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Box fontFamily="body">
      {/* Navbar */}
      <Box
        as="nav"
        position="fixed"
        top="0"
        width="full"
        zIndex="1000"
        bg={scrolled ? "white" : "transparent"}
        boxShadow={scrolled ? "md" : "none"}
        transition="all 0.3s ease"
      >
        <Container maxW="container.xl">
          <Flex py={3} align="center" justify="space-between">
            <Flex align="center">
              <MotionBox
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Text
                  fontFamily="heading"
                  fontWeight="bold"
                  fontSize="2xl"
                  color={scrolled ? "teal.700" : "white"}
                  textShadow={
                    scrolled ? "none" : "1px 1px 3px rgba(0, 0, 0, 0.6)"
                  }
                >
                  Geeky Chef
                </Text>
              </MotionBox>
            </Flex>

            <Button
              rounded="full"
              size="md"
              colorPalette="orange"
              bg="orange.400"
              _hover={{ bg: "orange.500" }}
              onClick={openAuthModal}
            >
              Get Started
            </Button>
          </Flex>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box
        pt={{ base: "100px", md: "0" }}
        h={{ base: "auto", md: "100vh" }}
        bgImage="linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/api/placeholder/1920/1080')"
        bgSize="cover"
        bgPosition="center"
      >
        <Container maxW="container.xl" h={{ md: "100%" }}>
          <Flex
            direction={{ base: "column", md: "row" }}
            align="center"
            justify="space-between"
            h={{ md: "100%" }}
            py={{ base: "16", md: "0" }}
          >
            <MotionBox
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              w={{ base: "full", md: "50%" }}
              mb={{ base: 10, md: 0 }}
            >
              <MotionHeading
                as="h1"
                fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
                color="white"
                fontWeight="bold"
                mb={4}
                lineHeight={1.1}
              >
                Revolutionize Your{" "}
                <Text as="span" color="orange.400">
                  Cooking Experience
                </Text>
              </MotionHeading>
              <MotionText
                fontSize={{ base: "md", md: "lg" }}
                color="gray.100"
                mb={8}
              >
                Discover, create, and plan meals with AI-powered precision.
                Geeky Chef brings cutting-edge technology to your kitchen,
                making cooking smarter and more enjoyable.
              </MotionText>
              <Stack direction={{ base: "column", sm: "row" }} spacing={4}>
                <Button
                  as={motion.button}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  size="lg"
                  rounded="full"
                  colorPalette="orange"
                  bg="orange.400"
                  _hover={{ bg: "orange.500" }}
                  px={8}
                  onClick={openAuthModal}
                >
                  Explore Recipes
                </Button>
                <Button
                  as={motion.button}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  size="lg"
                  rounded="full"
                  variant="outline"
                  colorPalette="whiteAlpha"
                  color="white"
                  _hover={{ bg: "whiteAlpha.200" }}
                  px={8}
                  onClick={openAuthModal}
                >
                  Try AI Features
                </Button>
              </Stack>
            </MotionBox>

            <MotionBox
              initial={{ opacity: 0, y: 70 }}
              animate={{ opacity: 1, y: 20 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              w={{ base: "full", md: "45%" }}
              textAlign="center"
              alignItems={"center"}
              justifyContent={"center"}
              display="flex"
            >
              <MotionImage
                src={app}
                alt="Geeky Chef App"
                maxW="100%"
                borderRadius="4xl"
                shadow="4xl"
                whileHover={{ y: -10 }}
                transition={{ duration: 0.5 }}
              />
            </MotionBox>
          </Flex>
        </Container>
      </Box>

      {/* Features Section */}
      <Box py={20} bg="gray.50">
        <Container maxW="container.xl">
          <SectionTitle
            title="Discover the Power of Geeky Chef"
            subtitle="Our recipe platform combines powerful search capabilities with personalization features to make cooking easier and more enjoyable."
          />

          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={8} mt={10}>
            <FeatureCard
              icon={Search}
              title="Smart Recipe Search"
              description="Find recipes by title, ingredients, or nutritional content with our intelligent search system."
              delay={0.1}
            />
            <FeatureCard
              icon={Globe}
              title="Nutrition & Cuisine Filters"
              description="Apply detailed filters for nutrition values and explore cuisine options from around the world."
              delay={0.2}
            />
            <FeatureCard
              icon={Heart}
              title="Save Favorites"
              description="Keep track of your favorite recipes for quick access whenever inspiration strikes."
              delay={0.3}
            />
            <FeatureCard
              icon={Globe}
              title="Global Cuisines"
              description="Explore recipes from different cultures and expand your culinary horizons."
              delay={0.4}
            />
          </SimpleGrid>
        </Container>
      </Box>

      {/* Video Section */}
      <Box py={16} bg="teal.700">
        <Container maxW="container.xl">
          <Flex
            direction={{ base: "column", lg: "row" }}
            align="center"
            justify="space-between"
          >
            <MotionBox
              w={{ base: "100%", lg: "40%" }}
              mb={{ base: 10, lg: 0 }}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Heading
                as="h2"
                fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
                fontWeight="bold"
                color="white"
                mb={4}
              >
                See Geeky Chef in Action
              </Heading>
              <Text fontSize={{ base: "md", lg: "lg" }} color="gray.200" mb={5}>
                Watch how our platform transforms the way you discover recipes,
                plan meals, and interact with food through cutting-edge AI
                technology.
              </Text>
            </MotionBox>

            <MotionBox
              w={{ base: "100%", lg: "55%" }}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <AspectRatio
                ratio={16 / 9}
                rounded="xl"
                overflow="hidden"
                shadow="2xl"
              >
                <Box
                  as="video"
                  autoPlay
                  muted
                  loop
                  src={video}
                  fallback={
                    <Image
                      src="/api/placeholder/1280/720"
                      alt="Video placeholder"
                      objectFit="cover"
                    />
                  }
                  objectFit="cover"
                  borderRadius="xl"
                />
              </AspectRatio>
            </MotionBox>
          </Flex>
        </Container>
      </Box>

      {/* AI Features */}
      <Box py={20} bg="white">
        <Container maxW="container.xl">
          <SectionTitle
            title="Cutting-Edge AI Features"
            subtitle="Experience the future of cooking with our advanced artificial intelligence and computer vision technology"
          />

          <Box mt={16}>
            <AIFeatureCard
              icon={Camera}
              title="Computer Vision Food Analysis"
              description="Upload a photo of any food item and instantly receive accurate nutritional information. Our advanced computer vision technology analyzes the image to identify ingredients and estimate nutritional content."
              image="/api/placeholder/800/600"
              isReversed={false}
              delay={0.1}
            />

            <AIFeatureCard
              icon={Search}
              title="Ingredient Detection"
              description="Never wonder what's in your meal again. Our ingredient detection feature uses machine learning to identify all components in a dish, helping with dietary restrictions, allergies, and precise nutritional tracking."
              image="/api/placeholder/800/600"
              isReversed={true}
              delay={0.2}
            />

            <AIFeatureCard
              icon={Heart}
              title="AI Chatbot Assistant"
              description="Get personalized cooking advice, recipe modifications, and meal planning help from our AI assistant. Upload images, ask complex questions, and receive tailored guidance for your culinary needs."
              image="/api/placeholder/800/600"
              isReversed={false}
              delay={0.3}
            />
          </Box>
        </Container>
      </Box>

      {/* Meal Plan Section */}
      <Box py={20} bg="gray.50">
        <Container maxW="container.xl">
          <SectionTitle
            title="Personalized Meal Planning"
            subtitle="Let AI create your perfect weekly meal plan based on your preferences, dietary needs, and schedule"
          />

          <Flex
            direction={{ base: "column", lg: "row" }}
            align="center"
            justify="space-between"
            mt={10}
          >
            <MotionBox
              w={{ base: "100%", lg: "48%" }}
              mb={{ base: 12, lg: 0 }}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Flex align="center" mb={6}>
                <Box p={3} bg="teal.50" borderRadius="full" mr={4}>
                  <Icon as={Calendar} color="teal.500" w={6} h={6} />
                </Box>
                <Heading
                  as="h3"
                  fontSize={{ base: "xl", md: "2xl" }}
                  color="gray.800"
                >
                  Smart Meal Planning
                </Heading>
              </Flex>

              <Text fontSize={{ base: "md", md: "lg" }} color="gray.600" mb={8}>
                Our AI-powered meal planning system creates personalized weekly
                menus tailored to your taste preferences, nutritional goals, and
                schedule. Save time, reduce food waste, and enjoy diverse,
                healthy meals.
              </Text>

              <Stack spacing={2} mb={8}>
                {[
                  "Customized meal plans based on your preferences and dietary needs",
                  "Dynamic adjustment for calories, macros, and food restrictions",
                  "Weekly shopping lists generated automatically",
                  "Seasonal recipe recommendations",
                  "Balance between nutrition and enjoyment",
                  "Time-saving meal prep suggestions",
                ].map((feature, index) => (
                  <MotionBox
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                  >
                    <Flex align="center" mb={4}>
                      <Icon as={CheckCircle} color="orange.400" mr={2} />
                      <Text fontSize={{ base: "md", md: "lg" }}>{feature}</Text>
                    </Flex>
                  </MotionBox>
                ))}
              </Stack>

              <Button
                as={motion.button}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                size="lg"
                rounded="full"
                colorPalette="orange"
                bg="orange.400"
                _hover={{ bg: "orange.500" }}
                px={8}
                onClick={openAuthModal}
              >
                Create Your Meal Plan
              </Button>
            </MotionBox>

            <MotionBox
              w={{ base: "100%", lg: "48%" }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Image
                src="/api/placeholder/800/600"
                alt="Meal Planning"
                borderRadius="xl"
                shadow="2xl"
              />
            </MotionBox>
          </Flex>
        </Container>
      </Box>

      {/* Testimonials */}
      <Box py={20} bg="white">
        <Container maxW="container.xl">
          <SectionTitle
            title="What Our Users Say"
            subtitle="Discover how Geeky Chef is revolutionizing cooking experiences for food enthusiasts, health-conscious individuals, and busy people"
          />

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={8} mt={10}>
            <TestimonialCard
              name="Emma Thompson"
              role="Food Blogger"
              quote="Geeky Chef has completely transformed how I develop recipes. The AI image analysis gives me precise nutritional information instantly, and the meal planning feature helps me create content for my followers efficiently."
              avatar="/api/placeholder/100/100"
              delay={0.1}
            />

            <TestimonialCard
              name="David Wilson"
              role="Fitness Coach"
              quote="I recommend Geeky Chef to all my clients. The ability to analyze food through photos and get accurate nutritional information is game-changing for those tracking their macros and calories."
              avatar="/api/placeholder/100/100"
              delay={0.2}
            />

            <TestimonialCard
              name="Sarah Chen"
              role="Busy Parent"
              quote="The meal planning feature saves me hours every week. I can customize plans for my family's dietary needs, and the AI chatbot has been incredibly helpful for modifying recipes when I'm missing ingredients."
              avatar="/api/placeholder/100/100"
              delay={0.3}
            />

            <TestimonialCard
              name="Michael Rodriguez"
              role="Amateur Chef"
              quote="The ingredient detection feature is mind-blowing! I can take a photo of a dish at a restaurant and recreate it at home. The AI assistant gives me tips on techniques I'm not familiar with."
              avatar="/api/placeholder/100/100"
              delay={0.4}
            />
          </SimpleGrid>
        </Container>
      </Box>

      {/* Footer */}
      <Box bg="gray.900" color="white">
        <Container maxW="container.xl" py={16}>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}>
            <Box>
              <Heading fontFamily="heading" fontSize="2xl" mb={6}>
                Geeky Chef
              </Heading>
              <Text fontSize="sm" color="gray.400" mb={6}>
                Revolutionizing your kitchen experience with AI-powered recipe
                discovery, meal planning, and intelligent food analysis.
              </Text>
              <Stack direction="row" spacing={4}>
                {[LuTwitter, LuFacebook, LuInstagram, LuLinkedin].map(
                  (SocialIcon, index) => (
                    <Link key={index} href="#" isExternal>
                      <Box
                        w="36px"
                        h="36px"
                        borderRadius="full"
                        bg="whiteAlpha.200"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        _hover={{ bg: "orange.400" }}
                        transition="all 0.3s ease"
                      >
                        <Icon as={SocialIcon} w={5} h={5} color="gray.400" />
                      </Box>
                    </Link>
                  ),
                )}
              </Stack>
            </Box>

            <Box>
              <Heading as="h4" fontSize="md" textTransform="uppercase" mb={6}>
                Features
              </Heading>
              <Stack spacing={3}>
                {[
                  "Recipe Search",
                  "Meal Planning",
                  "AI Food Analysis",
                  "Ingredient Detection",
                  "Favorites Collection",
                  "AI Chatbot",
                ].map((item, index) => (
                  <Link
                    key={index}
                    href="#"
                    fontSize="sm"
                    color="gray.400"
                    _hover={{ color: "orange.400" }}
                  >
                    {item}
                  </Link>
                ))}
              </Stack>
            </Box>

            <Box>
              <Heading as="h4" fontSize="md" textTransform="uppercase" mb={6}>
                Company
              </Heading>
              <Stack spacing={3}>
                {[
                  "About Us",
                  "Blog",
                  "Careers",
                  "Press",
                  "Partners",
                  "Privacy Policy",
                  "Terms of Service",
                ].map((item, index) => (
                  <Link
                    key={index}
                    href="#"
                    fontSize="sm"
                    color="gray.400"
                    _hover={{ color: "orange.400" }}
                  >
                    {item}
                  </Link>
                ))}
              </Stack>
            </Box>

            <Box>
              <Heading as="h4" fontSize="md" textTransform="uppercase" mb={6}>
                Subscribe
              </Heading>
              <Text fontSize="sm" color="gray.400" mb={4}>
                Get the latest recipes, features, and updates delivered directly
                to your inbox.
              </Text>
              <InputGroup
                size="md"
                mb={4}
                endElement={
                  <Button
                    h="1.75rem"
                    size="sm"
                    bg="orange.400"
                    _hover={{ bg: "orange.500" }}
                    borderRadius="md"
                  >
                    <Icon as={ChevronRight} />
                  </Button>
                }
              >
                <Input
                  pr="4.5rem"
                  placeholder="Your email"
                  bg="whiteAlpha.100"
                  border="none"
                  _focus={{
                    border: "1px solid",
                    borderColor: "orange.400",
                  }}
                />
                {/* <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    bg="orange.400"
                    _hover={{ bg: "orange.500" }}
                    borderRadius="md"
                  >
                    <Icon as={ChevronRight} />
                  </Button>
                </InputRightElement> */}
              </InputGroup>
              <Text fontSize="xs" color="gray.500">
                By subscribing, you agree to our Terms of Service and Privacy
                Policy.
              </Text>
            </Box>
          </SimpleGrid>

          <Separator my={10} borderColor="gray.700" />

          <Flex
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align={{ base: "center", md: "center" }}
          >
            <Text fontSize="sm" color="gray.500">
              © {new Date().getFullYear()} Geeky Chef. All rights reserved.
            </Text>
            <Stack direction="row" spacing={6} mt={{ base: 4, md: 0 }}>
              {["Privacy", "Terms", "Cookies", "Contact"].map((item, index) => (
                <Link
                  key={index}
                  href="#"
                  fontSize="sm"
                  color="gray.500"
                  _hover={{ color: "orange.400" }}
                >
                  {item}
                </Link>
              ))}
            </Stack>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
}

GeekyChefLanding.propTypes = {
  openAuthModal: PropTypes.func.isRequired,
};
