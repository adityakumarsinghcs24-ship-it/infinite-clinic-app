import React from 'react';
import { Button, VStack, Text, useToast } from '@chakra-ui/react';

export const TestAPI: React.FC = () => {
  const toast = useToast();

  const testLogin = async () => {
    try {
      console.log('Testing login API...');
      const response = await fetch('http://127.0.0.1:8000/auth/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'testuser' + Date.now(),
          email: 'test' + Date.now() + '@example.com',
          password: 'testpass123',
        }),
      });

      const data = await response.json();
      console.log('Login API response:', data);

      if (response.ok) {
        toast({
          title: 'Login API Works!',
          description: 'User registered successfully',
          status: 'success',
          duration: 3000,
        });
      } else {
        throw new Error(data.error || 'API failed');
      }
    } catch (error: any) {
      console.error('Login API error:', error);
      toast({
        title: 'Login API Failed',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    }
  };

  const testBooking = async () => {
    try {
      console.log('Testing booking API...');
      const response = await fetch('http://127.0.0.1:8000/api/mongo/book-test/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cart_items: [{
            name: 'Test Booking',
            price: 100,
            patients: [{
              name: 'Test Patient',
              age: '25',
              gender: 'Male'
            }]
          }],
          total_price: 100
        }),
      });

      const data = await response.json();
      console.log('Booking API response:', data);

      if (response.ok) {
        toast({
          title: 'Booking API Works!',
          description: 'Patient saved to MongoDB',
          status: 'success',
          duration: 3000,
        });
      } else {
        throw new Error(data.error || 'API failed');
      }
    } catch (error: any) {
      console.error('Booking API error:', error);
      toast({
        title: 'Booking API Failed',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <VStack spacing={4} p={8}>
      <Text fontSize="xl" fontWeight="bold">API Test Page</Text>
      <Button colorScheme="blue" onClick={testLogin}>
        Test Login API
      </Button>
      <Button colorScheme="green" onClick={testBooking}>
        Test Booking API
      </Button>
    </VStack>
  );
};