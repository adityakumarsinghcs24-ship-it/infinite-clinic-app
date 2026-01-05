import { VStack, Heading, Text, List, ListItem, ListIcon, Button } from '@chakra-ui/react';
import { FaCheckCircle } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';

export const PricingCard = ({ plan, isActive, onMouseEnter, onMouseLeave, id }: any) => {
  return (
    <VStack
      id={id}
      p={8}
      bg={isActive ? '#D7EBF090' : '#ADC1D690'}
      borderWidth="2px"
      borderColor={isActive ? '#384A5C' : '#404A3D'}
      borderRadius="xl"
      spacing={6}
      align="stretch"
      width="100%"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="pricing-card"
      flex="1" 
    >
      <Heading size="lg">{plan.name}</Heading>
      <Text fontSize="4xl" fontWeight="bold">
        ₹{plan.price}
      </Text>
      <List spacing={3}>
        {plan.features.map((feature: string, index: number) => (
          <ListItem key={index}>
            <ListIcon as={FaCheckCircle} color="#02966fff" />
            {feature}
          </ListItem>
        ))}
      </List>
      
      <Button 
        as={RouterLink}
        to="/health-plans"
        color={isActive ? 'WHITE' : 'BLACK'} 
        backgroundColor={isActive ? '#384A5C':'#ADD8E6'}
        borderWidth='2px' 
        borderColor='#31373C' 
        _hover={{backgroundColor:'white', color: 'black'}}
        mt="auto" pt={6} pb={6}
      >
        Book Now
      </Button>
    </VStack>
  );
};