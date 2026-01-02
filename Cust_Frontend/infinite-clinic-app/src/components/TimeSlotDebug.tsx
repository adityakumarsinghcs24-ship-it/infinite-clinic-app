import React, { useState } from 'react';
import {
  Box,
  Button,
  Text,
  VStack,
  HStack,
  Input,
  useToast,
  Code,
  Heading
} from '@chakra-ui/react';
import { API_ENDPOINTS } from '../config/api';

export const TimeSlotDebug: React.FC = () => {
  const [testDate, setTestDate] = useState(new Date().toISOString().split('T')[0]);
  const [response, setResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const testTimeSlots = async () => {
    setIsLoading(true);
    setResponse(null);
    
    try {
      console.log('Testing time slots API...');
      console.log('API URL:', `${API_ENDPOINTS.TIME_SLOTS}?date=${testDate}`);
      
      const response = await fetch(`${API_ENDPOINTS.TIME_SLOTS}?date=${testDate}`);
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      const data = await response.json();
      console.log('Response data:', data);
      
      setResponse({
        status: response.status,
        statusText: response.statusText,
        data: data
      });
      
      if (response.ok) {
        toast({
          title: 'API Test Successful',
          description: `Found ${data.slots?.length || 0} time slots`,
          status: 'success',
          duration: 3000,
        });
      } else {
        toast({
          title: 'API Test Failed',
          description: data.error || 'Unknown error',
          status: 'error',
          duration: 5000,
        });
      }
      
    } catch (error: any) {
      console.error('API Test Error:', error);
      setResponse({
        error: error.message,
        stack: error.stack
      });
      
      toast({
        title: 'Network Error',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createTimeSlots = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_ENDPOINTS.TIME_SLOTS.replace('/time-slots/', '/create-time-slots/')}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ days: 7 })
      });
      
      const data = await response.json();
      console.log('Create slots response:', data);
      
      if (response.ok) {
        toast({
          title: 'Time Slots Created',
          description: data.message,
          status: 'success',
          duration: 3000,
        });
      } else {
        toast({
          title: 'Failed to Create Slots',
          description: data.error,
          status: 'error',
          duration: 5000,
        });
      }
      
    } catch (error: any) {
      console.error('Create slots error:', error);
      toast({
        title: 'Network Error',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box p={6} maxW="800px" mx="auto">
      <VStack spacing={6} align="stretch">
        <Heading size="md">Time Slot API Debug</Heading>
        
        <HStack>
          <Input
            type="date"
            value={testDate}
            onChange={(e) => setTestDate(e.target.value)}
          />
          <Button
            onClick={testTimeSlots}
            isLoading={isLoading}
            colorScheme="blue"
          >
            Test API
          </Button>
          <Button
            onClick={createTimeSlots}
            isLoading={isLoading}
            colorScheme="green"
          >
            Create Slots
          </Button>
        </HStack>
        
        <Text fontSize="sm" color="gray.600">
          API Endpoint: {API_ENDPOINTS.TIME_SLOTS}
        </Text>
        
        {response && (
          <Box>
            <Text fontWeight="bold" mb={2}>API Response:</Text>
            <Code p={4} borderRadius="md" display="block" whiteSpace="pre-wrap" fontSize="sm">
              {JSON.stringify(response, null, 2)}
            </Code>
          </Box>
        )}
      </VStack>
    </Box>
  );
};