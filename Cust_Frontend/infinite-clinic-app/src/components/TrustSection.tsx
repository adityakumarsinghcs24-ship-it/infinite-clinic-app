import { Box, Button, Container, Flex, Heading, Text, VStack, Link } from '@chakra-ui/react';
import { Link as ScrollLink } from 'react-scroll';

export const TrustSection = () => {
  return (
    <Box
      maxW="100%"      
      w="100%"         
      mx={0}           
      py={{ base: 10, md: 20 }}
      mt={0}
      borderRadius="xl"
      position="relative"
      overflow="hidden"
      bgGradient="radial(circle, #ffffffff 20%, #CFE4DE 50%,  #384A5C 130%,)"
    >
      <Container maxW="1400px">
        <VStack spacing={6} textAlign="center" position="relative" zIndex={1}>
          <Flex
            align="center"
            justify="center"
            bg="#AAD6CA"
            color="#31373c"
            px={4}
            py={2}
            borderRadius="full"
            fontSize="sm"
            fontWeight="medium"
            mb={4}
          >
            <Box as="span" mr={2}></Box> We care for your health like family — experience hassle-free testing with us!
            <Link href="#" ml={1} textDecoration="underline" _hover={{ color: '#ffffffff', backgroundColor: '#31373C'}}>Find us now</Link>
          </Flex>

          <Heading as="h2" size="3xl" maxW="800px">
            Your Neighborhood Lab for Health You Can Trust
          </Heading>

          <Text fontSize="xl" color="gray.600" maxW="600px">
            Accurate tests, fast reports, and personalized care — all under one roof, right here in your city.
          </Text>

          <ScrollLink to="health-plans" smooth={true} duration={500} offset={-80}>
            <Button color="#FFFFFF"
            backgroundColor='#384A5C'
                            _hover={{
                  bg: '#ffffff',
                  color: 'black',
                  borderWidth: '2px',
                  borderColor: '#000000'
                }}
            size="lg"
            px={8}
            py={6}
            fontSize="xl"
            mt={6}>
              View Health Plans
            </Button>
          </ScrollLink>
        </VStack>
      </Container>
    </Box>
  );
};