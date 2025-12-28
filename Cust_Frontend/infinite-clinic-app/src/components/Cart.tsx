import { 
  Box, Heading, Text, Button, VStack, HStack, Spacer, Divider, CloseButton, Center, useToast 
} from '@chakra-ui/react';
import { useState } from 'react';
import { API_ENDPOINTS } from '../config/api';

export const Cart = ({ cart, onRemove }: any) => {
  const [isCheckoutComplete, setIsCheckoutComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const toast = useToast();

  // Safe calculation in case cart is undefined
  const safeCart = cart || [];
  const cartTotal = safeCart.reduce((total: number, item: any) => total + (item.price * item.patients.length), 0);


  const handleCheckout = async () => {
    setIsLoading(true);
    
    try {
      // Prepare data for MongoDB
      const bookingData = {
        cart_items: safeCart.map((item: any) => ({
          name: item.name,
          price: item.price,
          patients: item.patients.filter((p: any) => {
            // Only include patients with valid data (not "Self" entries)
            return p.name && 
                   p.age && 
                   p.gender && 
                   !p.name.startsWith('Self') &&
                   p.name.trim() !== '';
          })
        })),
        total_price: cartTotal
      };

      console.log('Sending booking data:', bookingData); // Debug log
      console.log('Original cart data:', safeCart); // Debug log

      // Send to MongoDB via Django API
      const response = await fetch(API_ENDPOINTS.BOOK_TEST, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();
      console.log('Booking response:', result); // Debug log

      if (!response.ok) {
        throw new Error(result.error || 'Booking failed');
      }
      
      // Simple success message
      toast({
        title: 'Booking Done!',
        description: `${result.total_patients_saved || 0} patients saved to database`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setBookingDetails(result);
      setIsCheckoutComplete(true);

    } catch (error: any) {
      console.error('Booking error:', error); // Debug log
      toast({
        title: 'Booking Failed',
        description: error.message || 'Please try again later',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box 
      position="sticky" 
      top="120px" 
      zIndex={1000} // Force layer to top
      borderWidth="1px" 
      borderRadius="lg" 
      p={6} 
      shadow="sm" 
      bg="white"
    >
      {isCheckoutComplete ? (
        <Center flexDirection="column" py={10}>
          <Text fontSize="4xl" mb={4}>✅</Text>
          <Heading size="md" mb={2} color="green.500">Booking Confirmed!</Heading>
          {bookingDetails && (
            <VStack spacing={2} mt={4}>
              <Text fontSize="sm"><strong>Booking ID:</strong> {bookingDetails.booking_id}</Text>
              <Text fontSize="sm"><strong>Patients Saved:</strong> {bookingDetails.total_patients_saved || 0}</Text>
              <Text fontSize="sm"><strong>Amount:</strong> ₹{bookingDetails.total_amount}</Text>
            </VStack>
          )}
          <Text color="gray.600" mt={2}>Patient data saved to database!</Text>
          <Button mt={4} onClick={() => {
            setIsCheckoutComplete(false);
            setBookingDetails(null);
          }}>Book More Tests</Button>
        </Center>
      ) : (
        <>
          <Heading size="md" mb={6}>Your Cart ({safeCart.length})</Heading>
          
          {safeCart.length === 0 ? (
            <Text color="gray.500">Your cart is currently empty.</Text>
          ) : (
            <VStack align="stretch" spacing={6}>
              {safeCart.map((item: any) => (
                <VStack key={item.cartId} align="stretch" spacing={3}>
                  <HStack>
                    <Text fontWeight="semibold">{item.name}</Text>
                    <Spacer />
                    <Text fontWeight="bold">₹{item.price * item.patients.length}</Text>
                    <CloseButton size="sm" onClick={() => onRemove(item.cartId)} />
                  </HStack>
                  <Text fontSize="sm" color="gray.500">
                     {item.patients.length} patient(s)
                  </Text>
                </VStack>
              ))}
              <Divider my={4} />
              <HStack>
                <Text fontWeight="bold" fontSize="lg">Total</Text>
                <Spacer />
                <Text fontWeight="bold" fontSize="xl">₹{cartTotal}</Text>
              </HStack>
              
              <Button 
                colorScheme="green" 
                size="lg" 
                mt={4} 
                onClick={handleCheckout}
                isLoading={isLoading}
                loadingText="Processing..."
              >
                Book Tests & Save Patients
              </Button>
            </VStack>
          )}
        </>
      )}
    </Box>
  );
};