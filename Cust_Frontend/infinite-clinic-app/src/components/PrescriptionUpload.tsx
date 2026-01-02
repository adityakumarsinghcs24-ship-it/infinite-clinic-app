import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Text,
  VStack,
  HStack,
  Icon,
  useToast,
  Progress,
  Alert,
  AlertIcon,
  AlertDescription,
  CloseButton
} from '@chakra-ui/react';
import { FiUpload, FiFile } from 'react-icons/fi';

interface PrescriptionUploadProps {
  onFileUpload: (fileData: string, fileName: string) => void;
  onFileRemove: () => void;
  currentFile?: { name: string; data: string } | null;
}

export const PrescriptionUpload: React.FC<PrescriptionUploadProps> = ({
  onFileUpload,
  onFileRemove,
  currentFile
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
  const maxFileSize = 5 * 1024 * 1024; // 5MB

  const handleFileSelect = (file: File) => {
    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload JPG, PNG, or PDF files only',
        status: 'error',
        duration: 4000,
      });
      return;
    }

    // Validate file size
    if (file.size > maxFileSize) {
      toast({
        title: 'File too large',
        description: 'Please upload files smaller than 5MB',
        status: 'error',
        duration: 4000,
      });
      return;
    }

    setIsUploading(true);

    // Convert file to base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onFileUpload(result, file.name);
      setIsUploading(false);
      
      toast({
        title: 'Prescription uploaded',
        description: `${file.name} uploaded successfully`,
        status: 'success',
        duration: 3000,
      });
    };

    reader.onerror = () => {
      setIsUploading(false);
      toast({
        title: 'Upload failed',
        description: 'Please try again',
        status: 'error',
        duration: 3000,
      });
    };

    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemoveFile = () => {
    onFileRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box borderWidth="1px" borderRadius="lg" p={4} bg="white">
      <VStack spacing={4} align="stretch">
        <Text fontWeight="semibold" color="#31373C">
          Upload Prescription (Optional)
        </Text>

        {currentFile ? (
          // Show uploaded file
          <Alert status="success" borderRadius="md">
            <AlertIcon />
            <Box flex="1">
              <AlertDescription>
                <HStack justify="space-between" align="center">
                  <HStack>
                    <Icon as={FiFile} />
                    <Text fontSize="sm">{currentFile.name}</Text>
                  </HStack>
                  <CloseButton size="sm" onClick={handleRemoveFile} />
                </HStack>
              </AlertDescription>
            </Box>
          </Alert>
        ) : (
          // Show upload area
          <VStack spacing={4}>
            <Box
              border="2px dashed"
              borderColor={isDragging ? "#384A5C" : "#CBD5E0"}
              borderRadius="lg"
              p={8}
              textAlign="center"
              bg={isDragging ? "#D7EBF0" : "gray.50"}
              cursor="pointer"
              transition="all 0.2s"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleBrowseClick}
              _hover={{
                borderColor: "#384A5C",
                bg: "#D7EBF0"
              }}
            >
              <VStack spacing={3}>
                <Icon as={FiUpload} boxSize={8} color="#384A5C" />
                <Text fontWeight="medium" color="#31373C">
                  Drop your prescription here or click to browse
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Supports JPG, PNG, PDF (max 5MB)
                </Text>
              </VStack>
            </Box>

            {/* Alternative browse button */}
            <Button
              onClick={handleBrowseClick}
              leftIcon={<Icon as={FiUpload} />}
              colorScheme="blue"
              variant="outline"
              size="sm"
            >
              Choose File
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFileInputChange}
              style={{ display: 'none' }}
            />

            {isUploading && (
              <Box w="100%">
                <Text fontSize="sm" color="#31373C" mb={2}>
                  Uploading prescription...
                </Text>
                <Progress colorScheme="blue" isIndeterminate />
              </Box>
            )}
          </VStack>
        )}

        <Text fontSize="xs" color="gray.500">
          Prescription upload is optional but recommended for accurate test recommendations
        </Text>
      </VStack>
    </Box>
  );
};