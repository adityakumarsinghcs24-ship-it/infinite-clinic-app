import { Box, Text, VStack } from '@chakra-ui/react';
import { SafeImage } from './SafeImage';

export const ImageDebug = () => {
  const images = [
    '/hero-book.PNG',
    '/raikkonen2.avif',
    '/clinic_temp.jpg',
    '/your-doctor-image.png',
    '/vite.svg'
  ];

  return (
    <Box p={4} bg="gray.100" borderRadius="md" m={4}>
      <Text fontSize="lg" fontWeight="bold" mb={4}>Image Loading Debug</Text>
      <VStack spacing={4}>
        {images.map((src, index) => (
          <Box key={index} border="1px" borderColor="gray.300" p={2} borderRadius="md">
            <Text fontSize="sm" mb={2}>Path: {src}</Text>
            <SafeImage
              src={src}
              alt={`Test image ${index + 1}`}
              maxW="200px"
              maxH="150px"
              objectFit="contain"
              onLoad={() => console.log(`✅ Loaded: ${src}`)}
              onError={() => console.log(`❌ Failed: ${src}`)}
            />
          </Box>
        ))}
      </VStack>
    </Box>
  );
};