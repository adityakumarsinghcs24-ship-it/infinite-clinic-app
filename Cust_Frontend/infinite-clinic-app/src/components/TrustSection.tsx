import { Box, Button, Container, Flex, Heading, Text, VStack, Link } from '@chakra-ui/react';
import { Link as ScrollLink } from 'react-scroll';

export const TrustSection = () => {
  return (
    <Box
      w="100%"
      position="relative"
      overflow="hidden"
      // Clean, soft gradient background
      bg="linear-gradient(180deg, #FFFFFF 0%, #F5FAF9 100%)"
      py={{ base: 16, md: 28 }}
    >
      {/* Soft Blur Blob for depth (No Grid) */}
      <Box
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        w={{ base: '300px', md: '600px' }}
        h={{ base: '300px', md: '600px' }}
        bg="#CFE4DE"
        opacity="0.6"
        filter="blur(100px)"
        zIndex={0}
        borderRadius="full"
      />

      <Container maxW="1200px" position="relative" zIndex={1}>
        <VStack spacing={8} textAlign="center">
          
          {/* Top Badge */}
          <Flex
            align="center"
            justify="center"
            bg="rgba(170, 214, 202, 0.3)" 
            backdropFilter="blur(5px)"
            border="1px solid"
            borderColor="#AAD6CA"
            color="#2D3A45"
            px={5}
            py={2}
            borderRadius="full"
            fontSize="sm"
            fontWeight="600"
            boxShadow="sm"
            transition="all 0.2s"
            _hover={{ bg: "rgba(170, 214, 202, 0.5)" }}
          >
            <Text as="span">We care for your health like family. Feel free to get in touch</Text>
            <Box w="1px" h="15px" bg="#384A5C" mx={3} opacity={0.3} />
            <Link 
              href="#" 
              textDecoration="none" 
              _hover={{ textDecoration: "underline", color: "#384A5C" }}
              fontWeight="700"
            >
              Contact Us
            </Link>
          </Flex>

          {/* Main Heading */}
          <Heading
            as="h2"
            size="3xl"
            fontWeight="800"
            color="#384A5C"
            maxW="900px"
            lineHeight="1.2"
            letterSpacing="-0.02em"
          >
            Your Neighborhood Lab for <br />
            <Text as="span" bgGradient="linear(to-r, #384A5C, #5C7C99)" bgClip="text">
              Health You Can Trust
            </Text>
          </Heading>

          {/* Subtext */}
          <Text 
            fontSize={{ base: "lg", md: "xl" }} 
            color="gray.600" 
            maxW="650px" 
            lineHeight="1.6"
          >
            Accurate tests, fast reports, and personalized care—all under one roof, 
            providing clarity right here in your city.
          </Text>

          {/* CTA Button */}
          <ScrollLink to="health-plans" smooth={true} duration={500} offset={-80}>
            <Button
              bg="#384A5C"
              color="white"
              size="lg"
              h="60px"
              px={10}
              fontSize="lg"
              fontWeight="bold"
              borderRadius="full"
              boxShadow="0px 10px 20px rgba(56, 74, 92, 0.2)"
              transition="all 0.3s ease"
              _hover={{
                transform: 'translateY(-3px)',
                boxShadow: '0px 15px 25px rgba(56, 74, 92, 0.3)',
                bg: '#2D3A45',
              }}
              _active={{
                transform: 'translateY(-1px)',
                boxShadow: 'none',
              }}
            >
              View Health Plans
            </Button>
          </ScrollLink>
        </VStack>
      </Container>
    </Box>
  );
};