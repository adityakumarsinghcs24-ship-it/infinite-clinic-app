import { 
  Box, Container, Heading, Text, VStack, Button, Input, 
  FormControl, FormLabel, SimpleGrid, Tabs, TabList, TabPanels, 
  Tab, TabPanel, Badge, Card, CardBody, Stack, Divider, 
  useToast, Flex, Icon 
} from '@chakra-ui/react';
import { useState } from 'react';
import { FaCalendarCheck, FaUserEdit, FaSave } from 'react-icons/fa';

export const Dashboard = () => {
  const toast = useToast();

  // --- STATE 1: User Profile Data ---
  const [profile, setProfile] = useState({
    name: 'Student User',
    email: 'student@example.com',
    phone: '+91 98765 43210',
    age: '21'
  });

  // --- STATE 2: Mock Bookings Data ---
  // In a real app, you would fetch this from your backend
  const bookings = [
    { id: 1, test: 'Comprehensive Scan', date: 'Jan 24, 2026', time: '10:00 AM', price: '₹1700', status: 'Upcoming' },
    { id: 2, test: 'Basic Wellness', date: 'Jan 10, 2026', time: '09:00 AM', price: '₹900', status: 'Completed' },
  ];

  // Handle Input Changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  // specific to Age (numbers only)
  const handleAgeChange = (value: string) => {
    setProfile(prev => ({ ...prev, age: value }));
  };

  // Mock Save Function
  const handleSave = () => {
    toast({
      title: "Profile Updated.",
      description: "Your information has been saved successfully.",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top", 
    });
  };

  return (
    <Box bg="#F7FAFC" minH="80vh" py={10}>
      <Container maxW="container.lg">
        
        {/* Page Title */}
        <VStack align="start" mb={8} spacing={1}>
          <Heading size="xl" color="#384A5C">My Dashboard</Heading>
          <Text color="gray.600">Manage your bookings and personal details.</Text>
        </VStack>

        {/* Main Content Area */}
        <Tabs variant="enclosed" colorScheme="blue" bg="white" p={6} borderRadius="xl" shadow="sm" border="1px" borderColor="gray.200">
          <TabList mb={4}>
            <Tab fontWeight="bold" _selected={{ color: 'white', bg: '#384A5C' }}><Icon as={FaCalendarCheck} mr={2}/> My Bookings</Tab>
            <Tab fontWeight="bold" _selected={{ color: 'white', bg: '#384A5C' }}><Icon as={FaUserEdit} mr={2}/> Update Profile</Tab>
          </TabList>

          <TabPanels>
            
            {/* TAB 1: BOOKINGS */}
            <TabPanel>
              <VStack spacing={4} align="stretch">
                {bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <Card key={booking.id} variant="outline" borderColor="gray.300" _hover={{ shadow: 'md' }}>
                      <CardBody>
                        <Flex justify="space-between" align={{ base: 'start', md: 'center' }} direction={{ base: 'column', md: 'row' }} gap={4}>
                          <Box>
                            <Heading size="md" color="#384A5C" mb={1}>{booking.test}</Heading>
                            <Text color="gray.500" fontSize="sm">
                              {booking.date} at {booking.time}
                            </Text>
                          </Box>
                          
                          <Stack direction="row" align="center" spacing={4}>
                            <Text fontWeight="bold" color="#384A5C">{booking.price}</Text>
                            <Badge 
                              colorScheme={booking.status === 'Upcoming' ? 'blue' : 'green'} 
                              p={1} 
                              px={3} 
                              borderRadius="full"
                            >
                              {booking.status}
                            </Badge>
                            {booking.status === 'Upcoming' && (
                              <Button size="sm" colorScheme="red" variant="ghost">Cancel</Button>
                            )}
                          </Stack>
                        </Flex>
                      </CardBody>
                    </Card>
                  ))
                ) : (
                  <Text color="gray.500">No bookings found.</Text>
                )}
              </VStack>
            </TabPanel>

            {/* TAB 2: UPDATE PROFILE */}
            <TabPanel>
              <Box maxW="600px">
                <VStack spacing={6} align="start">
                  
                  <Heading size="md" mb={2}>Personal Information</Heading>
                  
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="100%">
                    <FormControl>
                      <FormLabel>Full Name</FormLabel>
                      <Input 
                        name="name" 
                        value={profile.name} 
                        onChange={handleInputChange} 
                        borderColor="gray.300" 
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Age</FormLabel>
                      <Input 
                        name="age" 
                        type="number"
                        value={profile.age} 
                        onChange={(e) => handleAgeChange(e.target.value)} 
                        borderColor="gray.300" 
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Email Address</FormLabel>
                      <Input 
                        name="email" 
                        type="email" 
                        value={profile.email} 
                        onChange={handleInputChange} 
                        borderColor="gray.300" 
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Phone Number</FormLabel>
                      <Input 
                        name="phone" 
                        type="tel" 
                        value={profile.phone} 
                        onChange={handleInputChange} 
                        borderColor="gray.300" 
                      />
                    </FormControl>
                  </SimpleGrid>

                  <Divider />

                  <Button 
                    leftIcon={<FaSave />} 
                    colorScheme="blue" 
                    bg="#384A5C" 
                    _hover={{ bg: '#2D3A45' }}
                    onClick={handleSave}
                    size="lg"
                  >
                    Save Changes
                  </Button>

                </VStack>
              </Box>
            </TabPanel>

          </TabPanels>
        </Tabs>

      </Container>
    </Box>
  );
};