import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
  Spinner,
  Alert,
  AlertIcon,
  VStack,
  Button,
  useToast,
} from '@chakra-ui/react';

interface Patient {
  id: string;
  first_name: string;
  age: number;
  gender: string;
  phone_number: string;
  email: string;
  created_at: string;
}

export const PatientList: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const fetchPatients = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://127.0.0.1:8000/api/mongo/patients/');
      
      if (!response.ok) {
        throw new Error('Failed to fetch patients');
      }

      const data = await response.json();
      setPatients(data);
      setError(null);
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

  useEffect(() => {
    fetchPatients();
  }, []);

  const getGenderBadge = (gender: string) => {
    const colorScheme = gender === 'M' ? 'blue' : gender === 'F' ? 'pink' : 'gray';
    const label = gender === 'M' ? 'Male' : gender === 'F' ? 'Female' : 'Other';
    return <Badge colorScheme={colorScheme}>{label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <Container maxW="6xl" py={8}>
        <VStack spacing={4}>
          <Spinner size="xl" />
          <Heading size="md">Loading patients...</Heading>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="6xl" py={8}>
      <VStack spacing={6}>
        <Box textAlign="center">
          <Heading size="lg" color="blue.600" mb={2}>
            Patient Database
          </Heading>
          <Button onClick={fetchPatients} colorScheme="blue" size="sm">
            Refresh Data
          </Button>
        </Box>

        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}

        {patients.length === 0 ? (
          <Alert status="info">
            <AlertIcon />
            No patients found. Register some patients to see them here!
          </Alert>
        ) : (
          <TableContainer w="100%">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Age</Th>
                  <Th>Gender</Th>
                  <Th>Phone</Th>
                  <Th>Email</Th>
                  <Th>Registered</Th>
                </Tr>
              </Thead>
              <Tbody>
                {patients.map((patient) => (
                  <Tr key={patient.id}>
                    <Td fontWeight="medium">{patient.first_name}</Td>
                    <Td>{patient.age}</Td>
                    <Td>{getGenderBadge(patient.gender)}</Td>
                    <Td>{patient.phone_number}</Td>
                    <Td>{patient.email}</Td>
                    <Td>{formatDate(patient.created_at)}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}

        <Box textAlign="center" color="gray.600">
          Total Patients: {patients.length}
        </Box>
      </VStack>
    </Container>
  );
};