import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Text,
  VStack,
  useToast,
  Alert,
  AlertIcon
} from '@chakra-ui/react';

export const SimpleUploadTest: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadStatus(`Selected: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
      
      toast({
        title: 'File selected',
        description: `${file.name} is ready to upload`,
        status: 'success',
        duration: 3000,
      });
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadStatus('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Box borderWidth="1px" borderRadius="lg" p={4} bg="white" w="100%">
      <VStack spacing={4} align="stretch">
        <Text fontWeight="semibold" color="#31373C">
          Simple Upload Test
        </Text>

        {selectedFile ? (
          <Alert status="success" borderRadius="md">
            <AlertIcon />
            <Box flex="1">
              <Text fontSize="sm">{uploadStatus}</Text>
              <Button size="sm" mt={2} onClick={handleRemoveFile}>
                Remove File
              </Button>
            </Box>
          </Alert>
        ) : (
          <VStack spacing={3}>
            <Box
              border="2px dashed #CBD5E0"
              borderRadius="lg"
              p={6}
              textAlign="center"
              bg="gray.50"
              w="100%"
            >
              <Text color="gray.600" mb={3}>
                Click the button below to select a file
              </Text>
              <Button
                onClick={handleBrowseClick}
                colorScheme="blue"
                size="md"
              >
                Choose File
              </Button>
            </Box>

            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
          </VStack>
        )}

        <Text fontSize="xs" color="gray.500">
          This is a simple test to verify file upload functionality
        </Text>
      </VStack>
    </Box>
  );
};