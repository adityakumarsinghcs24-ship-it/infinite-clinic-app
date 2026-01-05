import { Box, Container, SimpleGrid, VStack, Heading, Text, Flex, Link as ChakraLink } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <Box bg="gray.900" color="gray.300">
      <Container maxW="container.xl" py={16}>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
          <VStack align="flex-start" spacing={4}>
            <Heading size="md" color="white">Get Help</Heading>
            <ChakraLink as={Link} to="/faq">FAQs</ChakraLink>
            <Text>📞 +91 9351012745</Text>
            <Text>📩 idcudaipur@gmail.com</Text>
          </VStack>

          <VStack align="flex-start" spacing={4}>
            <Heading size="md" color="white">Explore about us</Heading>
            <ChakraLink as={Link} to="/AboutUs">Who we are</ChakraLink>
          </VStack>
          
          <Box />
        </SimpleGrid>
        <Box mt={16}>
          <Heading size="md" color="white" mb={6}>Our Health Hub</Heading>
          <SimpleGrid columns={{ base: 2, md: 4 }} spacingX={10} spacingY={4}>
            <Text>Udaipur</Text>
          </SimpleGrid>
        </Box>
      </Container>
      <Box borderTopWidth="1px" borderColor="gray.700">
        <Container maxW="container.xl" py={4} display="flex" flexDirection={{ base: 'column', md: 'row' }} justifyContent="space-between" alignItems="center">
          <Text fontSize="sm">© 2025 Infinite Clinic Pvt. Ltd.</Text>
          <Flex gap={6} mt={{ base: 4, md: 0 }}>
            <ChakraLink as={Link} to="/privacy-policy" fontSize="sm">Privacy Policy</ChakraLink>
            <ChakraLink as={Link} to="/grievance" fontSize="sm">Grievance Redressal</ChakraLink>
            <ChakraLink as={Link} to="/terms-of-use" fontSize="sm">Terms of Use</ChakraLink>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
};