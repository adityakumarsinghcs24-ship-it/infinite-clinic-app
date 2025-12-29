import { Box, Text, VStack } from '@chakra-ui/react';
import { SafeImage } from './SafeImage';

export const ImageDebug = () => {
  const images = [
    { src: '/hero-book.PNG', name: 'Hero Book' },
    { src: '/raikkonen2.avif', name: 'Raikkonen' },
    { src: '/clinic_temp.jpg', name: 'Clinic Temp' },
    { src: '/vite.svg', name: 'Vite Logo' }
  ];

  return (
    <Box p={4} bg="gray.100" borderRadius="md" m={4}>
      <Text fontSize="lg" fontWeight="bold" mb={4}>Image Loading Debug</Text>
      <VStack spacing={4}>
        {images.map((img, index) => (
          <Box key={index} border="1px" borderColor="gray.300" p={2} borderRadius="md" w="100%">
            <Text fontSize="sm" mb={2}>Path: {img.src} ({img.name})</Text>
            <SafeImage
              src={img.src}
              alt={`Test image ${img.name}`}
              maxW="200px"
              maxH="150px"
              objectFit="contain"
              onLoad={() => console.log(`✅ Loaded: ${img.src}`)}
              onError={() => console.log(`❌ Failed: ${img.src}`)}
            />
          </Box>
        ))}
      </VStack>
    </Box>
  );
};