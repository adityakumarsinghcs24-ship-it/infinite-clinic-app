import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  SimpleGrid,
  Input,
  FormControl,
  FormLabel,
  useToast,
  Badge,
  Spinner,
  Center
} from '@chakra-ui/react';
import { API_ENDPOINTS } from '../config/api';

interface TimeSlot {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  display_time: string;
  available_slots: number | null;
  booked_slots: number;
  unlimited_patients: boolean;
  available: boolean;
}

interface TimeSlotSelectorProps {
  onTimeSlotSelect: (slotId: string | null, slotInfo: string) => void;
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({
  onTimeSlotSelect,
  selectedDate,
  onDateChange
}) => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [customTime, setCustomTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useCustomTime, setUseCustomTime] = useState(false);
  const toast = useToast();

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  
  // Get date 30 days from now
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  useEffect(() => {
    if (selectedDate) {
      fetchTimeSlots(selectedDate);
    }
  }, [selectedDate]);

  const fetchTimeSlots = async (date: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_ENDPOINTS.TIME_SLOTS}?date=${date}`);
      const data = await response.json();
      
      if (response.ok) {
        setTimeSlots(data.slots || []);
      } else {
        toast({
          title: 'Error loading time slots',
          description: data.error || 'Please try again',
          status: 'error',
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Error fetching time slots:', error);
      toast({
        title: 'Error loading time slots',
        description: 'Please check your connection',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot.id);
    setUseCustomTime(false);
    setCustomTime('');
    onTimeSlotSelect(slot.id, slot.display_time);
  };

  const handleCustomTimeSelect = () => {
    if (!customTime) {
      toast({
        title: 'Please enter a preferred time',
        status: 'warning',
        duration: 2000,
      });
      return;
    }
    
    setSelectedSlot(null);
    setUseCustomTime(true);
    onTimeSlotSelect(null, customTime);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    onDateChange(newDate);
    setSelectedSlot(null);
    setUseCustomTime(false);
    setCustomTime('');
    onTimeSlotSelect(null, '');
  };

  return (
    <Box borderWidth="1px" borderRadius="lg" p={6} bg="white" shadow="sm">
      <VStack spacing={6} align="stretch">
        <Heading size="md" color="#31373C">
          Select Date & Time
        </Heading>

        {/* Date Selection */}
        <FormControl>
          <FormLabel color="#31373C">Preferred Date</FormLabel>
          <Input
            type="date"
            value={selectedDate}
            min={today}
            max={maxDateStr}
            onChange={handleDateChange}
            borderColor="#31373C"
            _hover={{ borderColor: '#384A5C' }}
          />
        </FormControl>

        {/* Time Slot Selection */}
        {selectedDate && (
          <>
            <Box>
              <Text fontWeight="semibold" mb={3} color="#31373C">
                Available Time Slots for {new Date(selectedDate).toLocaleDateString()}
              </Text>
              
              {isLoading ? (
                <Center py={8}>
                  <Spinner color="#384A5C" />
                </Center>
              ) : timeSlots.length > 0 ? (
                <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={3}>
                  {timeSlots.map((slot) => (
                    <Button
                      key={slot.id}
                      variant={selectedSlot === slot.id ? "solid" : "outline"}
                      colorScheme={selectedSlot === slot.id ? "blue" : "gray"}
                      size="sm"
                      onClick={() => handleSlotSelect(slot)}
                      isDisabled={!slot.available}
                      bg={selectedSlot === slot.id ? "#384A5C" : "white"}
                      borderColor="#31373C"
                      color={selectedSlot === slot.id ? "white" : "#31373C"}
                      _hover={{
                        bg: selectedSlot === slot.id ? "#2C3A48" : "#D7EBF0",
                        borderColor: "#384A5C"
                      }}
                    >
                      <VStack spacing={1}>
                        <Text fontSize="sm" fontWeight="bold">
                          {slot.display_time}
                        </Text>
                        {!slot.unlimited_patients && (
                          <Badge
                            size="xs"
                            colorScheme={slot.available_slots && slot.available_slots > 5 ? "green" : "orange"}
                          >
                            {slot.available_slots} left
                          </Badge>
                        )}
                      </VStack>
                    </Button>
                  ))}
                </SimpleGrid>
              ) : (
                <Text color="gray.500" textAlign="center" py={4}>
                  No time slots available for this date
                </Text>
              )}
            </Box>

            {/* Custom Time Option */}
            <Box borderTop="1px" borderColor="gray.200" pt={4}>
              <Text fontWeight="semibold" mb={3} color="#31373C">
                Or specify your preferred time
              </Text>
              <HStack>
                <Input
                  placeholder="e.g., 2:30 PM or Morning"
                  value={customTime}
                  onChange={(e) => setCustomTime(e.target.value)}
                  borderColor="#31373C"
                  _hover={{ borderColor: '#384A5C' }}
                />
                <Button
                  onClick={handleCustomTimeSelect}
                  bg={useCustomTime ? "#384A5C" : "white"}
                  color={useCustomTime ? "white" : "#31373C"}
                  borderColor="#31373C"
                  borderWidth="1px"
                  _hover={{
                    bg: useCustomTime ? "#2C3A48" : "#D7EBF0"
                  }}
                >
                  Select
                </Button>
              </HStack>
              {useCustomTime && customTime && (
                <Text fontSize="sm" color="green.600" mt={2}>
                  ✓ Preferred time: {customTime}
                </Text>
              )}
            </Box>
          </>
        )}
      </VStack>
    </Box>
  );
};