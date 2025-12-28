import { Box, Circle, Flex, Heading, Text, VStack } from '@chakra-ui/react';
import { FaTint, FaLungs, FaHeartbeat, FaVial, FaCapsules, FaArrowRight } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';

const popularTests = [
  { name: 'Sugar Fasting', icon: FaTint },
  { name: 'Thyroid Profile', icon: FaLungs },
  { name: 'Lipid Profile Screen', icon: FaHeartbeat },
  { name: 'CBC', icon: FaVial },
  { name: 'Vitamin D3', icon: FaCapsules },
  { name: 'View More', icon: FaArrowRight },
];

export const CategorySection = () => {
  return (
    <Box>
      <VStack spacing={4} textAlign="center" mb={10}>
        <Heading size="xl">Explore Tests</Heading>
        <Text fontSize="lg" color="gray.600">
          Featuring our most popular diagnostic tests.
        </Text>
      </VStack>

      <Flex justify="center" gap={{ base: 6, md: 10 }} wrap="wrap">
        {popularTests.map((test) => {
          const bubbleContent = (
            <VStack spacing={3} cursor="pointer" _hover={{ color: '#31373c', transform: 'scale(1.05)' }} transition="transform 0.2s">
              <Circle size="100px" bg="#D7EBF0" color="#384A5C" _hover={{ color: '#D2DEEA', background:'#404a3d'}}>
                <test.icon size="40px" />
              </Circle>
              <Text fontWeight="medium" textAlign="center">{test.name}</Text>
            </VStack>
          );

          if (test.name === 'View More') {
            return (
              <RouterLink to="/all-tests" key={test.name}>
                {bubbleContent}
              </RouterLink>
            );
          }

          return (
            <Box key={test.name}>
              {bubbleContent}
            </Box>
          );
        })}
      </Flex>
    </Box>
  );
};