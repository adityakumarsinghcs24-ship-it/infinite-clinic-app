import { Box, Heading, Text, Button, Tag, VStack, HStack, Spacer, IconButton } from '@chakra-ui/react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { motion } from 'framer-motion';

export const TestCard = ({ test, cartItem, onAdd, onUpdateQuantity }: any) => {
  const quantity = cartItem ? cartItem.patients.length : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Box borderWidth="1px" borderRadius="xl" p={6} width="100%" bg="white" _hover={{ shadow: 'md' }}>
        <VStack align="stretch" spacing={3}>
          <Heading size="md">{test.name}</Heading>
          <Text fontSize="sm" color="gray.600">{test.description}</Text>
          <Tag
            size="sm"
            variant="subtle"
            colorScheme={test.prerequisite.includes('fasting') ? 'orange' : 'green'}
            borderRadius="full"
            width="fit-content"
          >
            {test.prerequisite}
          </Tag>
          <HStack mt={2}>
            <Text fontSize="xl" fontWeight="bold">₹{test.price}</Text>
            <Spacer />
            {quantity === 0 ? (
              <Button backgroundColor='#ADD8E6' color="black" _hover={{color:'white', backgroundColor: '#384a5c', borderWidth:'1px', borderColor: '#31373C'}} onClick={onAdd}>Add</Button>
            ) : (
              <HStack bg="gray.100" borderRadius="full">
                <IconButton
                  aria-label="Decrease quantity"
                  icon={<FaMinus />}
                  size="sm"
                  isRound
                  onClick={() => onUpdateQuantity(quantity - 1)}
                />
                <Text fontWeight="bold" width="24px" textAlign="center">{quantity}</Text>
                <IconButton
                  aria-label="Increase quantity"
                  icon={<FaPlus />}
                  size="sm"
                  isRound
                  onClick={() => onUpdateQuantity(quantity + 1)}
                />
              </HStack>
            )}
          </HStack>
        </VStack>
      </Box>
    </motion.div>
  );
};