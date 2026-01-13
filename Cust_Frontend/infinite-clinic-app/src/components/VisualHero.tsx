import { Box, Button, Container, Flex, Heading, Text, VStack } from '@chakra-ui/react';
import { Link as ScrollLink } from 'react-scroll';
import { SafeImage } from './SafeImage';
import heroBookImg from '../assets/hero-book.PNG';

export const VisualHero = () => {
  return (
    <Box
      // 1. Set background to transparent to show the HomePage gradient
      bg="transparent"
      // 2. Remove the 'card' margins so it spans full width
      w="100%"
      // 3. Keep padding to ensure content isn't cramped
      py={{ base: 12, md: 24 }}
      position="relative"
      // 4. overflow="hidden" ensures the image doesn't cause horizontal scrolling
      overflow="hidden" 
    >
      <Container maxW="container.xl" position="relative" zIndex={2}>
        <Flex
          direction={{ base: 'column', md: 'row' }}
          align="center"
          justify="space-between"
          gap={10}
        >
          {/* Text Content */}
          <VStack
            align={{ base: 'center', md: 'flex-start' }}
            textAlign={{ base: 'center', md: 'left' }}
            maxW={{ base: 'full', md: '55%' }}
            spacing={6}
          >
            <Heading
              as="h1"
              fontSize={{ base: '3xl', md: '5xl', lg: '6xl' }}
              fontWeight="800"
              lineHeight="1.1"
              color="#384A5C"
              letterSpacing="-0.02em"
            >
              Book Lab Tests Online
            </Heading>
            
            <Text 
              fontSize={{ base: 'lg', md: 'xl' }} 
              color="#4A5568" 
              maxW="500px"
              lineHeight="1.6"
            >
              Get accurate diagnostic results quickly. Choose from a wide range of 
              tests and schedule appointments with ease.
            </Text>

            <ScrollLink to="book-a-test" smooth={true} duration={500} offset={-80}>
              <Button
                bg="#384A5C"
                color="#FFFFFF"
                size="lg"
                px={8}
                py={7} 
                fontSize="xl"
                rightIcon={<Box as="span" ml={2}>&rarr;</Box>}
                mt={2}
                borderWidth="2px"
                borderRadius="full"
                boxShadow="0px 10px 20px rgba(56, 74, 92, 0.2)"
                transition="all 0.3s ease"
                _hover={{
                  transform: 'translateY(-3px)',
                  boxShadow: '0px 15px 25px rgba(56, 74, 92, 0.3)',
                  bg: '#31373c',
                }}
                _active={{
                  transform: 'translateY(-1px)',
                  boxShadow: 'none',
                }}
              >
                Explore Tests
              </Button>
            </ScrollLink>
          </VStack>

          {/* Image Section */}
          <Box 
             position="relative" 
             w={{ base: '100%', md: '50%' }}
             h="100%"
             minH={{ base: '300px', md: 'auto' }}
             display={{ base: 'none', md: 'block' }}
          >
            <SafeImage
              src={heroBookImg}
              alt="A visual of diagnostic lab equipment"
              position="absolute"
              right={{ md: "-60px", lg: "-80px" }}
              bottom={{ md: "-100px", lg: "-270px" }}
              w={{ base: '300px', md: '500px', lg: '650px' }}
              zIndex={1}
              filter="drop-shadow(0px 20px 30px rgba(0,0,0,0.15))"
            />
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};