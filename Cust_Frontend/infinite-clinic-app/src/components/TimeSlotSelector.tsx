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
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setTimeSlots(data.slots || []);
      
      // If no slots available, show info message
      if (!data.slots || data.slots.length === 0) {
        toast({
          title: 'No time slots available',
          description: 'Please select a different date or use custom time option',
          status: 'info',
          duration: 4000,
        });
      }
      
    } catch (error: any) {
      console.error('Error fetching time slots:', error);
      
      // Fallback: Create default time slots on frontend
      const fallbackSlots = createFallbackTimeSlots(date);
      setTimeSlots(fallbackSlots);
      
      if (fallbackSlots.length > 0) {
        toast({
          title: 'Using default time slots',
          description: 'Backend unavailable, showing standard appointment times',
          status: 'info',
          duration: 4000,
        });
      } else {
        toast({
          title: 'Unable to load time slots',
          description: 'You can still specify your preferred time below',
          status: 'warning',
          duration: 5000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const createFallbackTimeSlots = (date: string): TimeSlot[] => {
    const selectedDate = new Date(date);
    const today = new Date();
    
    // Don't show slots for past dates or Sundays
    if (selectedDate < today || selectedDate.getDay() === 0) {
      return [];
    }
    
    // Create default time slots
    const timeSlots = [
      { start: '08:00', end: '09:00' },
      { start: '09:00', end: '10:00' },
      { start: '10:00', end: '11:00' },
      { start: '11:00', end: '12:00' },
      { start: '14:00', end: '15:00' },
      { start: '15:00', end: '16:00' },
      { start: '16:00', end: '17:00' },
      { start: '17:00', end: '18:00' },
    ];
    
    return timeSlots.map((slot, index) => ({
      id: `fallback_${date}_${index}`,
      date: date,
      start_time: slot.start,
      end_time: slot.end,
      display_time: `${slot.start} - ${slot.end}`,
      available_slots: 10,
      booked_slots: 0,
      unlimited_patients: false,
      available: true
    }));
  };

  const tryCreateTimeSlots = async (date: string) => {
    setIsLoading(true);
    try {
      const createUrl = API_ENDPOINTS.TIME_SLOTS.replace('/time-slots/', '/create-time-slots/');
      const response = await fetch(createUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ days: 7 })
      });
      
      if (response.ok) {
        toast({
          title: 'Time slots created',
          description: 'Refreshing available slots...',
          status: 'success',
          duration: 3000,
        });
        
        // Refresh the time slots
        setTimeout(() => {
          fetchTimeSlots(date);
        }, 1000);
      } else {
        throw new Error('Failed to create time slots');
      }
    } catch (error) {
      console.error('Error creating time slots:', error);
      
      // Use fallback slots
      const fallbackSlots = createFallbackTimeSlots(date);
      setTimeSlots(fallbackSlots);
      
      toast({
        title: 'Using default time slots',
        description: 'Backend unavailable, showing standard appointment times',
        status: 'info',
        duration: 4000,
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
                <VStack spacing={4}>
                  <Box textAlign="center" py={6} bg="gray.50" borderRadius="md">
                    <Text color="gray.600" mb={2}>
                      No time slots available for this date
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      Please select a different date or specify your preferred time below
                    </Text>
                  </Box>
                  
                  <Button
                    size="sm"
                    colorScheme="blue"
                    variant="outline"
                    onClick={() => tryCreateTimeSlots(selectedDate)}
                    isLoading={isLoading}
                  >
                    Try to Create Time Slots
                  </Button>
                </VStack>
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