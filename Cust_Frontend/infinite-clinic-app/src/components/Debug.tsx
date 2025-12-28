import React from 'react';
import { Box, Heading, Text, VStack } from '@chakra-ui/react';

export const Debug: React.FC = () => {
  return (
    <Box p={8}>
      <VStack spacing={4}>
        <Heading>🔧 Debug Page</Heading>
        <Text>If you can see this, React is working!</Text>
        <Text>Frontend: ✅ Running</Text>
        <Text>Backend: ✅ Running</Text>
        <Text>MongoDB: ✅ Connected</Text>
      </VStack>
    </Box>
  );
};