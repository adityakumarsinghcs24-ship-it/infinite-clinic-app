import { 
  Box, Heading, Text, Button, VStack, HStack, Spacer, Divider, CloseButton, Center, useToast,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, useDisclosure
} from '@chakra-ui/react';
import { useState } from 'react';
import { API_ENDPOINTS } from '../config/api';
import { TimeSlotSelector } from './TimeSlotSelector';
import { PrescriptionUpload } from './PrescriptionUpload';

export const Cart = ({ cart, onRemove }: any) => {
  const [isCheckoutComplete, setIsCheckoutComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [selectedTimeInfo, setSelectedTimeInfo] = useState<string>('');
  const [prescriptionFiles, setPrescriptionFiles] = useState<{[key: string]: {name: string, data: string}}>({});
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Add refresh trigger
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Safe calculation in case cart is undefined
  const safeCart = cart || [];
  const cartTotal = safeCart.reduce((total: number, item: any) => total + (item.price * item.patients.length), 0);

  const handleTimeSlotSelect = (slotId: string | null, slotInfo: string) => {
    setSelectedTimeSlot(slotId);
    setSelectedTimeInfo(slotInfo);
  };

  const handlePrescriptionUpload = (patientKey: string, fileData: string, fileName: string) => {
    setPrescriptionFiles(prev => ({
      ...prev,
      [patientKey]: { name: fileName, data: fileData }
    }));
  };

  const handlePrescriptionRemove = (patientKey: string) => {
    setPrescriptionFiles(prev => {
      const updated = { ...prev };
      delete updated[patientKey];
      return updated;
    });
  };

  const handleCheckout = async () => {
    if (!selectedDate) {
      toast({
        title: 'Please select a date',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    if (!selectedTimeInfo) {
      toast({
        title: 'Please select a time slot or specify preferred time',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Prepare data for MongoDB with prescriptions
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
          }).map((p: any) => {
            const patientKey = `${item.cartId}_${p.name}_${p.age}`;
            const prescription = prescriptionFiles[patientKey];
            
            return {
              ...p,
              prescription_file: prescription?.data,
              prescription_filename: prescription?.name
            };
          })
        })),
        total_price: cartTotal,
        booking_date: selectedDate,
        time_slot_id: selectedTimeSlot,
        preferred_time: selectedTimeSlot ? null : selectedTimeInfo
      };

      console.log('Sending booking data:', bookingData); // Debug log

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
      console.log('Booking details received:', {
        booking_id: result.booking_id,
        booking_date: result.booking_date,
        time_slot_info: result.time_slot_info,
        total_patients_saved: result.total_patients_saved,
        total_amount: result.total_amount
      });

      if (!response.ok) {
        throw new Error(result.error || 'Booking failed');
      }
      
      // Success message with time slot info
      const timeDisplay = result.time_slot_info?.time || selectedTimeInfo;
      toast({
        title: 'Booking Confirmed!',
        description: `Scheduled for ${new Date(selectedDate).toLocaleDateString()} at ${timeDisplay}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      setBookingDetails(result);
      setIsCheckoutComplete(true);
      
      // Refresh time slots to show updated availability
      setRefreshTrigger(prev => prev + 1);
      
      onClose(); // Close the booking modal

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

  const resetBooking = () => {
    setIsCheckoutComplete(false);
    setBookingDetails(null);
    setSelectedTimeSlot(null);
    setSelectedTimeInfo('');
    setPrescriptionFiles({});
  };

  return (
    <>
      <Box 
        position="sticky" 
        top="120px" 
        zIndex={1000}
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
              <VStack spacing={2} mt={4} align="stretch" bg="gray.50" p={4} borderRadius="md" minW="300px">
                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.600">Booking ID:</Text>
                  <Text fontSize="sm" fontWeight="bold">{bookingDetails.booking_id}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.600">Date:</Text>
                  <Text fontSize="sm" fontWeight="bold">
                    {new Date(bookingDetails.booking_date).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.600">Time:</Text>
                  <Text fontSize="sm" fontWeight="bold">
                    {bookingDetails.time_slot_info?.time || selectedTimeInfo || 'As per availability'}
                  </Text>
                </HStack>
                {bookingDetails.total_patients_saved > 0 && (
                  <HStack justify="space-between">
                    <Text fontSize="sm" color="gray.600">Patients:</Text>
                    <Text fontSize="sm" fontWeight="bold">{bookingDetails.total_patients_saved}</Text>
                  </HStack>
                )}
                <Divider />
                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.600">Total Amount:</Text>
                  <Text fontSize="md" fontWeight="bold" color="green.600">₹{bookingDetails.total_amount}</Text>
                </HStack>
              </VStack>
            )}
            <Text color="gray.600" mt={4} textAlign="center" fontSize="sm">
              Your appointment has been scheduled successfully!<br />
              We'll contact you shortly to confirm the details.
            </Text>
            <Button mt={4} onClick={resetBooking} colorScheme="green">Book More Tests</Button>
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
                  onClick={onOpen}
                  bg="#384A5C"
                  _hover={{ bg: "#2C3A48" }}
                >
                  Schedule Appointment
                </Button>
              </VStack>
            )}
          </>
        )}
      </Box>

      {/* Booking Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent maxW="800px">
          <ModalHeader color="#31373C">Schedule Your Appointment</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={6} align="stretch">
              {/* Time Slot Selection */}
              <TimeSlotSelector
                onTimeSlotSelect={handleTimeSlotSelect}
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                refreshTrigger={refreshTrigger}
              />

              {/* Prescription Upload for each patient */}
              <Box>
                <Heading size="sm" mb={4} color="#31373C">
                  Upload Prescriptions (Optional)
                </Heading>
                
                <VStack spacing={4}>
                  {safeCart.length > 0 ? (
                    safeCart.map((item: any) => {
                      const validPatients = item.patients.filter((p: any) => 
                        p.name && !p.name.startsWith('Self') && p.name.trim() !== ''
                      );
                      
                      if (validPatients.length === 0) {
                        // Show a general upload for the test if no specific patients
                        const generalKey = `${item.cartId}_general`;
                        return (
                          <Box key={generalKey} w="100%">
                            <Text fontSize="sm" fontWeight="medium" mb={2} color="#31373C">
                              Prescription for {item.name}
                            </Text>
                            <PrescriptionUpload
                              onFileUpload={(fileData, fileName) => 
                                handlePrescriptionUpload(generalKey, fileData, fileName)
                              }
                              onFileRemove={() => handlePrescriptionRemove(generalKey)}
                              currentFile={prescriptionFiles[generalKey]}
                            />
                          </Box>
                        );
                      }
                      
                      return validPatients.map((patient: any) => {
                        const patientKey = `${item.cartId}_${patient.name}_${patient.age}`;
                        return (
                          <Box key={patientKey} w="100%">
                            <Text fontSize="sm" fontWeight="medium" mb={2} color="#31373C">
                              Prescription for {patient.name} (Age: {patient.age}) - {item.name}
                            </Text>
                            <PrescriptionUpload
                              onFileUpload={(fileData, fileName) => 
                                handlePrescriptionUpload(patientKey, fileData, fileName)
                              }
                              onFileRemove={() => handlePrescriptionRemove(patientKey)}
                              currentFile={prescriptionFiles[patientKey]}
                            />
                          </Box>
                        );
                      });
                    })
                  ) : (
                    <Box w="100%">
                      <Text fontSize="sm" color="gray.500" mb={4}>
                        Add tests to your cart to upload prescriptions
                      </Text>
                      <PrescriptionUpload
                        onFileUpload={(fileData, fileName) => 
                          handlePrescriptionUpload('general', fileData, fileName)
                        }
                        onFileRemove={() => handlePrescriptionRemove('general')}
                        currentFile={prescriptionFiles['general']}
                      />
                    </Box>
                  )}
                </VStack>
              </Box>

              {/* Booking Summary */}
              <Box borderWidth="1px" borderRadius="lg" p={4} bg="gray.50">
                <Heading size="sm" mb={3} color="#31373C">Booking Summary</Heading>
                <VStack spacing={2} align="stretch">
                  <HStack justify="space-between">
                    <Text fontSize="sm">Date:</Text>
                    <Text fontSize="sm" fontWeight="medium">
                      {selectedDate ? new Date(selectedDate).toLocaleDateString() : 'Not selected'}
                    </Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm">Time:</Text>
                    <Text fontSize="sm" fontWeight="medium">
                      {selectedTimeInfo || 'Not selected'}
                    </Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm">Total Amount:</Text>
                    <Text fontSize="sm" fontWeight="bold">₹{cartTotal}</Text>
                  </HStack>
                </VStack>
              </Box>

              {/* Confirm Booking Button */}
              <Button
                onClick={handleCheckout}
                isLoading={isLoading}
                loadingText="Booking..."
                bg="#384A5C"
                color="white"
                size="lg"
                _hover={{ bg: "#2C3A48" }}
                isDisabled={!selectedDate || !selectedTimeInfo}
              >
                Confirm Booking
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};