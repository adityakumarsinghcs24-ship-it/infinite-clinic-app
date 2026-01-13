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
    <Box 
      position="relative" 
      overflow="hidden" 
      py={10} // Added padding so the glow has room to breathe
    >
      
      {/* --- THE GLOW EFFECT (Copied from TrustSection) --- */}
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

      {/* --- CONTENT WRAPPER --- */}
      {/* We need this relative/zIndex wrapper so the glow doesn't cover the buttons */}
      <Box position="relative" zIndex={1}>
        <VStack spacing={4} textAlign="center" mb={10}>
          <Heading size="xl" color="#384A5C">
            Explore Tests
          </Heading>
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

            // Note: Fixed the condition logic here. 
            // In JS, (x === 'A' || 'B') is always true because 'B' is truthy.
            // It must be (x === 'A' || x === 'B' ...). 
            // However, checking just 'View More' is usually sufficient for the link, 
            // unless you want ALL bubbles to link to /all-tests.
            if (['View More', 'Vitamin D3', 'CBC', 'Lipid Profile Screen', 'Thyroid Profile', 'Sugar Fasting'].includes(test.name)) {
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
    </Box>
  );
};