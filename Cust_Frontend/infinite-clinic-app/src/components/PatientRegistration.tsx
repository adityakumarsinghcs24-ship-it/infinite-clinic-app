import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  Heading,
  Alert,
  AlertIcon,
  useToast,
  Container,
  Card,
  CardBody,
} from '@chakra-ui/react';

interface PatientData {
  first_name: string;
  age: number;
  gender: string;
  phone_number: string;
  email: string;
}

export const PatientRegistration: React.FC = () => {
  const [formData, setFormData] = useState<PatientData>({
    first_name: '',
    age: 0,
    gender: '',
    phone_number: '',
    email: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/mongo/patients/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to register patient');
      }

      const result = await response.json();
      
      toast({
        title: 'Success!',
        description: `Patient ${result.first_name} registered successfully!`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Reset form
      setFormData({
        first_name: '',
        age: 0,
        gender: '',
        phone_number: '',
        email: '',
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="md" py={8}>
      <Card>
        <CardBody>
          <VStack spacing={6}>
            <Heading size="lg" textAlign="center" color="blue.600">
              Patient Registration
            </Heading>

            {error && (
              <Alert status="error">
                <AlertIcon />
                {error}
              </Alert>
            )}

            <Box as="form" onSubmit={handleSubmit} w="100%">
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Full Name</FormLabel>
                  <Input
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Age</FormLabel>
                  <Input
                    name="age"
                    type="number"
                    value={formData.age || ''}
                    onChange={handleInputChange}
                    placeholder="Enter your age"
                    min="1"
                    max="120"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Gender</FormLabel>
                  <Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    placeholder="Select gender"
                  >
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="O">Other</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Phone Number</FormLabel>
                  <Input
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                  />
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  w="100%"
                  isLoading={isLoading}
                  loadingText="Registering..."
                >
                  Register Patient
                </Button>
              </VStack>
            </Box>
          </VStack>
        </CardBody>
      </Card>
    </Container>
  );
};