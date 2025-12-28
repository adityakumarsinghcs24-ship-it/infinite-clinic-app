import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  Button, Select, FormControl, FormLabel
} from '@chakra-ui/react';

export const PatientCountModal = ({ isOpen, onClose, onConfirm, patientCount, setPatientCount }: any) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select Patients</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>How many patients for this test?</FormLabel>
            <Select value={patientCount} onChange={(e) => setPatientCount(parseInt(e.target.value))}>
              {[1, 2, 3, 4, 5].map(num => <option key={num} value={num}>{num}</option>)}
            </Select>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={onConfirm}>
            Continue
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};