import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Input,
  Text,
  VStack,
  FormControl,
  FormLabel,
  useToast,
  Divider,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
// Using simple text for show/hide password 
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api';

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const { login } = useAuth();

  // Form State
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '', // Only for signup
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    console.log('Form submitted:', { isLogin, formData }); // Debug log

    // Basic Validation
    if (!isLogin && formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords do not match",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setIsLoading(false);
      return;
    }

    // --- MONGODB BACKEND CONNECTION ---
    const endpoint = isLogin ? API_ENDPOINTS.LOGIN : API_ENDPOINTS.REGISTER;
    
    console.log('Making request to:', endpoint); // Debug log
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.email,
          email: formData.email,
          password: formData.password,
        }),
        credentials: 'include', // Important for cookies
      });

      console.log('Response status:', response.status); // Debug log
      const data = await response.json();
      console.log('Response data:', data); // Debug log

      if (response.ok) {
        toast({
          title: isLogin ? "Welcome back!" : "Account created!",
          description: "Redirecting...",
          status: "success",
          duration: 2000,
        });
        
        // Save user data to auth context
        if (data.user) {
          login(data.user);
        } else {
          // Fallback user data (shouldn't be needed now)
          login({
            id: 1,
            username: formData.email.split('@')[0],
            email: formData.email
          });
        }
        
        // Redirect logic
        navigate('/'); 
      } else {
        throw new Error(data.message || "Something went wrong");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box minH="100vh" py={{ base: 12, md: 20 }}>
      <Container maxW="container.lg">
        {/* Header Section similar to About Us */}
        <Heading
          as="h2"
          size="3xl"
          mb={10}
          textAlign="center"
          fontWeight="extrabold"
          color="#31373C"
        >
          {isLogin ? 'Welcome Back.' : 'Join InfiniteClinic.'}
        </Heading>

        <Flex
          direction={{ base: 'column', md: 'row' }}
          gap={{ base: 10, md: 16 }}
          align="center"
          justify="center"
        >
          {/* Main Auth Card */}
          <Box
            flex={{ base: '1', md: '0.6' }}
            bg="#D2DEEA95" // Your specific transparent blue
            borderColor="#31373C"
            borderWidth="1px"
            borderRadius="30px" // Matching your design language
            p={{ base: 8, md: 12 }}
            boxShadow="lg"
            width="100%"
          >
            <VStack spacing={6} as="form" onSubmit={handleSubmit} align="stretch">
              
              <Heading as="h3" size="lg" textAlign="center" color="#31373C">
                {isLogin ? 'Sign In' : 'Create Account'}
              </Heading>
              
              <Divider borderColor="#31373C" />

              <FormControl isRequired>
                <FormLabel color="#31373C">Email Address</FormLabel>
                <Input
                  name="email"
                  type="email"
                  bg="white"
                  borderColor="#31373C"
                  _hover={{ borderColor: '#384A5C' }}
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="name@example.com"
                  borderRadius="10px"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel color="#31373C">Password</FormLabel>
                <InputGroup>
                  <Input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    bg="white"
                    borderColor="#31373C"
                    value={formData.password}
                    onChange={handleInputChange}
                    borderRadius="10px"
                    placeholder="Enter your password"
                  />
                  <InputRightElement width="4.5rem">
                    <Button
                      h="1.75rem"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      bg="transparent"
                      fontSize="xs"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              {!isLogin && (
                <FormControl isRequired>
                  <FormLabel color="#31373C">Confirm Password</FormLabel>
                  <Input
                    name="confirmPassword"
                    type="password"
                    bg="white"
                    borderColor="#31373C"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    borderRadius="10px"
                    placeholder="Confirm your password"
                  />
                </FormControl>
              )}

              <Button
                type="submit"
                isLoading={isLoading}
                loadingText="Processing"
                backgroundColor="#384A5C" // Your primary dark blue
                color="#ffffff"
                size="lg"
                width="100%"
                _hover={{ bg: '#2C3A48' }}
                mt={4}
                borderRadius="10px"
              >
                {isLogin ? 'Sign In' : 'Sign Up'}
              </Button>

              <Text textAlign="center" fontSize="sm" color="#384a5c">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <Button
                  variant="link"
                  color="#ffffff" 
                  fontWeight="bold"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setFormData({ email: '', password: '', confirmPassword: '' });
                  }}
                >
                  {isLogin ? 'Sign Up' : 'Log In'}
                </Button>
              </Text>

            </VStack>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};