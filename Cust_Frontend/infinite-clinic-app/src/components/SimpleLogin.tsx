import React, { useState } from 'react';
import { Box, Button, Input, VStack, Text, useToast } from '@chakra-ui/react';

export const SimpleLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleLogin = async () => {
    setIsLoading(true);
    console.log('Attempting login with:', { username, password });

    try {
      const response = await fetch('http://127.0.0.1:8000/api/mongo/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
        credentials: 'include',
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        toast({
          title: 'Login Successful!',
          description: `Welcome ${data.user.username}`,
          status: 'success',
          duration: 3000,
        });
      } else {
        throw new Error(data.error || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: 'Login Failed',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    setIsLoading(true);
    console.log('Attempting register with:', { username, password });

    try {
      const response = await fetch('http://127.0.0.1:8000/api/mongo/auth/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          email: username + '@example.com',
          password: password,
        }),
        credentials: 'include',
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        toast({
          title: 'Registration Successful!',
          description: `Account created for ${data.user.username}`,
          status: 'success',
          duration: 3000,
        });
      } else {
        throw new Error(data.error || 'Registration failed');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: 'Registration Failed',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box p={8} maxW="400px" mx="auto">
      <VStack spacing={4}>
        <Text fontSize="xl" fontWeight="bold">Simple Login Test</Text>
        
        <Input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <Button
          colorScheme="blue"
          onClick={handleLogin}
          isLoading={isLoading}
          w="100%"
        >
          Login
        </Button>
        
        <Button
          colorScheme="green"
          onClick={handleRegister}
          isLoading={isLoading}
          w="100%"
        >
          Register
        </Button>
        
        <Text fontSize="sm" color="gray.500">
          Check browser console for debug logs
        </Text>
      </VStack>
    </Box>
  );
};