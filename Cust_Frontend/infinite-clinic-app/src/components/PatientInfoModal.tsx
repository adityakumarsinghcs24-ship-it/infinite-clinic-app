import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  Button, VStack, FormControl, FormLabel, Input, Select, Box, Heading, RadioGroup, Stack, Radio, Text
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';

export const PatientInfoModal = ({ isOpen, onClose, cartItem, onSave }: any) => {
  const [patients, setPatients] = useState(cartItem.patients);
  const [isForSelf, setIsForSelf] = useState('self'); 

  useEffect(() => {
    if (cartItem.patients[0]?.name.startsWith('Self')) {
      setIsForSelf('self');
    } else if (cartItem.patients.length > 0 && cartItem.patients[0]?.name !== '') {
      setIsForSelf('someone');
    }
    setPatients(cartItem.patients);
  }, [cartItem]);

  const handleInputChange = (index: number, field: string, value: string) => {
    const newPatients = [...patients];
    newPatients[index] = { ...newPatients[index], [field]: value };
    setPatients(newPatients);
  };

  const handleSave = () => {
    let finalPatients = [...patients];
    if (isForSelf === 'self') {
      // For "Self" bookings, we'll let the backend handle it
      // Don't save empty patient data
      finalPatients[0] = { name: `Self (Patient 1)`, age: '0', gender: 'O' };
    }
    onSave(cartItem.cartId, finalPatients);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Patient Information for "{cartItem.name}"</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={6} align="stretch">
            <FormControl>
              <FormLabel>Who is Patient 1?</FormLabel>
              <RadioGroup value={isForSelf} onChange={setIsForSelf}>
                <Stack direction="row">
                  <Radio value="self">Myself</Radio>
                  <Radio value="someone">Someone Else</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>

            {patients.map((patient: any, index: number) => {
              if (index === 0 && isForSelf === 'self') {
                return (
                  <Box key={index} p={4} borderWidth="1px" borderRadius="md" bg="gray.50">
                    <Heading size="sm" mb={2}>Patient 1: Self</Heading>
                    <Text fontSize="sm" color="gray.500">Your details will be used from your account profile.</Text>
                  </Box>
                );
              }
              return (
                <Box key={index} p={4} borderWidth="1px" borderRadius="md">
                  <Heading size="sm" mb={4}>Patient {index + 1}</Heading>
                  <VStack spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Name</FormLabel>
                      <Input placeholder="Enter patient's name" value={patient.name} onChange={(e) => handleInputChange(index, 'name', e.target.value)} />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Age</FormLabel>
                      <Input placeholder="Enter age" type="number" value={patient.age} onChange={(e) => handleInputChange(index, 'age', e.target.value)} />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Gender</FormLabel>
                      <Select placeholder="Select gender" value={patient.gender} onChange={(e) => handleInputChange(index, 'gender', e.target.value)}>
                        <option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
                      </Select>
                    </FormControl>
                  </VStack>
                </Box>
              );
            })}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button color='#384a5c' mr={3} onClick={onClose}>Cancel</Button>
          <Button colorScheme="blue" onClick={handleSave}>Save Information</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};