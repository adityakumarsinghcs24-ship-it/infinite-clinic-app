import { Box, Button, Container, Flex, Heading, Text, VStack, Image as ChakraImage, color } from '@chakra-ui/react';
import { Link as ScrollLink } from 'react-scroll';

export const VisualHero = () => {
  return (
    <Box
      bg="#D7EBF0"
      color="#31373C"
      py={{ base: 10, md: 20 }}
      mt={{ base: 4, md: 8 }}
      borderRadius="xl"
      mx={{ base: 4, md: 8 }}
    >
      <Container maxW="container.xl">
        <Flex
          direction={{ base: 'column', md: 'row' }}
          align="center"
          justify="space-between"
          gap={10}
          position="relative"
        >
          <VStack
            align={{ base: 'center', md: 'flex-start' }}
            textAlign={{ base: 'center', md: 'left' }}
            maxW={{ base: 'full', md: '50%' }}
            spacing={4}
            zIndex={2}
          >
            <Heading as="h1" fontSize={{ base: '3xl', md: '5xl', lg: '6xl' }} lineHeight="1.1" mb={4}>
              Book Lab Tests Online
            </Heading>
            <Text fontSize={{ base: 'md', md: 'xl' }} color="#31373C" maxW="500px">
              Get accurate diagnostic results quickly. Choose from a wide range of tests and schedule appointments with ease.
            </Text>
            <ScrollLink to="book-a-test" smooth={true} duration={500} offset={-80}>
              <Button 
                bg="#384A5C"
                color="#FFFFFF"
                size="lg" 
                px={8} 
                py={6} 
                fontSize="xl" 
                rightIcon={<Box as="span" ml={2}>&rarr;</Box>} 
                mt={6}
                borderWidth="2px"
                borderColor="transparent"
                _hover={{
                  bg: '#ffffff',
                  color: 'black',
                  borderColor: '#000000'
                }}
              >
                Explore Tests
              </Button>
            </ScrollLink>
          </VStack>

          <ChakraImage
            src="/hero-book.PNG"
            alt="A visual of diagnostic lab equipment"
            position="absolute"
            right="-50px"
            bottom="-80px"
            w={{ base: '300px', md: '450px', lg: '550px' }}
            display={{ base: 'none', md: 'block' }}
            zIndex={1}
          />
        </Flex>
      </Container>
    </Box>
  );
};