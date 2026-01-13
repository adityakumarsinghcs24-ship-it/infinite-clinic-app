import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Stack,
  Text,
  VStack,
  HStack,
  Divider,
  AbsoluteCenter,
  useToast,

} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  EmailIcon,
  LockIcon,
  ViewIcon,
  ViewOffIcon,
} from '@chakra-ui/icons';
import { FaUserPlus, FaSignInAlt, FaClinicMedical } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api';

// Animation components
const MotionBox = motion(Box);
const MotionVStack = motion(VStack);

export const AuthPage = () => {
  // --- LOGIC SECTION ---
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
    confirmPassword: '', 
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

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
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.email,
          email: formData.email,
          password: formData.password,
        }),
        credentials: 'include',
      });

      const data = await response.json();

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
          login({
            id: 1, // Fallback ID
            username: formData.email.split('@')[0],
            email: formData.email
          });
        }
        
        navigate('/'); 
      } else {
        throw new Error(data.message || "Something went wrong");
      }
    } catch (error: any) {
      toast({
        title: "Authentication Failed",
        description: error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ email: '', password: '', confirmPassword: '' });
    setShowPassword(false);
  };


  const brandDark = "#384A5C";
 return (
    <Flex minH="100vh">
      {/*LEFT PANEL*/}
      <Box
        display={{ base: "none", lg: "flex" }}
        w="50%"

        bgGradient="linear(to-br, #607183, #384a5c, #607183)" 
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          top="20"
          left="20"
          w="64"
          h="64"
          borderRadius="full"
          bg="#d7ebf0"
          opacity={0.2}
          filter="blur(60px)"
        />
        <Box
          position="absolute"
          bottom="20"
          right="10"
          w="80"
          h="80"
          borderRadius="full"
          bg="#adc1d6"
          opacity={0.15}
          filter="blur(60px)"
        />
         <Box
          position="absolute"
          top="50%"
          left="33%"
          w="48"
          h="48"
          borderRadius="full"
          bg="#d7ebf0"
          opacity={0.1}
          filter="blur(40px)"
        />

        <VStack
          position="relative"
          zIndex={10}
          justify="center"
          align="center"
          w="full"
          p={12}
          color="#fffefeff"
          spacing={8}
        >
          <HStack spacing={3}>
            <Flex
              w={14}
              h={14}
              borderRadius="2xl"
              bg="rgba(255, 255, 255, 0.2)"
              align="center"
              justify="center"
              backdropFilter="blur(8px)"
            >
              <Icon as={FaClinicMedical} boxSize={8} color="#FFFFFF" />
            </Flex>
            <Text fontSize="3xl" fontWeight="bold" letterSpacing="tight">
              InfiniteClinic
            </Text>
          </HStack>

          <VStack spacing={2}>
            <Heading
              size="xl"
              textAlign="center"
              lineHeight="tight"
              fontWeight="bold"
            >
              Healthcare <br /> Reimagined.
            </Heading>
          </VStack>

          <Text fontSize="lg" textAlign="center" color="rgba(255, 255, 255, 0.8)" maxW="md">
            Manage your clinic seamlessly. Secure, reliable, and designed for modern healthcare professionals.
          </Text>
        </VStack>
      </Box>

      {/*RIGHT PANEL*/}
      <Flex
        w={{ base: "full", lg: "50%" }}
        align="center"
        justify="center"
        p={{ base: 6, sm: 12 }}
        bg="#e3eaf2ff"
      >
        <MotionBox
          w="full"
          maxW="md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Mobile Logo*/}
          <HStack display={{ base: "flex", lg: "none" }} justify="center" spacing={2} mb={8}>
             <Icon as={FaClinicMedical} boxSize={8} color={brandDark} />
             <Text fontSize="2xl" fontWeight="bold" color={brandDark}>
              InfiniteClinic
            </Text>
          </HStack>

          <Box
            bg="white"
            borderRadius="2xl"
            boxShadow="xl"
            p={{ base: 6, md: 10 }}
          >
            <VStack spacing={2} mb={8} textAlign="center">
              <Heading size="lg" color={brandDark}>
                {isLogin ? "Welcome Back" : "Join InfiniteClinic"}
              </Heading>
              <Text color="gray.500">
                {isLogin
                  ? "Sign in to access your dashboard"
                  : "Start your journey today"}
              </Text>
            </VStack>

            <form onSubmit={handleSubmit}>
              <Stack spacing={5}>
                
                {/* Email*/}
                <FormControl isRequired>
                  <FormLabel>Email Address</FormLabel>
                  <InputGroup>
                    <InputLeftElement h="48px" pointerEvents="none">
                      <EmailIcon color="gray.400" boxSize={5} />
                    </InputLeftElement>
                    <Input
                      name="email"
                      type="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      h="48px"
                      pl={12}
                    />
                  </InputGroup>
                </FormControl>

                {/* Password*/}
                <FormControl isRequired>
                  <FormLabel>Password</FormLabel>
                  <InputGroup>
                    <InputLeftElement h="48px" pointerEvents="none">
                      <LockIcon color="gray.400" boxSize={5} />
                    </InputLeftElement>
                    <Input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      h="48px"
                      pl={12}
                      pr={12}
                    />
                    <InputRightElement h="48px">
                      <IconButton
                        aria-label={showPassword ? "Hide" : "Show"}
                        icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                        color="black"
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                {/* Confirm Password*/}
                <AnimatePresence>
                  {!isLogin && (
                    <MotionVStack
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      overflow="hidden"
                    >
                      <FormControl isRequired w="full" pt={5}>
                        <FormLabel>Confirm Password</FormLabel>
                        <InputGroup>
                          <InputLeftElement h="48px" pointerEvents="none">
                            <LockIcon color="gray.400" boxSize={5} />
                          </InputLeftElement>
                          <Input
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            h="48px"
                            pl={12}
                          />
                        </InputGroup>
                      </FormControl>
                    </MotionVStack>
                  )}
                </AnimatePresence>

                {/* Submit*/}
                <Button
                  type="submit"
                  size="lg"
                  borderColor={brandDark}
                  h="48px"
                  bg={brandDark}
                  color="white"
                  isLoading={isLoading}
                  _hover={{ bg: "#D7EBF0", color:"#31373C" }}
                  leftIcon={
                    isLogin ? <Icon as={FaSignInAlt} /> : <Icon as={FaUserPlus} />
                  }
                >
                  {isLogin ? "Sign In" : "Create Account"}
                </Button>
              </Stack>
            </form>

            {/*Divider*/}
            <Box position="relative" my={8}>
              <Divider borderColor="gray.200" />
              <AbsoluteCenter bg="white" px={4}>
                <Text fontSize="sm" color="gray.500">
                  {isLogin ? "New here?" : "Member already?"}
                </Text>
              </AbsoluteCenter>
            </Box>

            {/*Toggle*/}
            <Button
              variant="outline"
              w="full"
              size="lg"
              h="48px"
              color="white"
              bg={brandDark}
              _hover={{ bg: "#D7EBF0", color: "#384A5C"}}
              onClick={toggleMode}
            >
              {isLogin ? "Create an account" : "Sign in instead"}
            </Button>

          </Box>
        </MotionBox>
      </Flex>
    </Flex>
  );
};