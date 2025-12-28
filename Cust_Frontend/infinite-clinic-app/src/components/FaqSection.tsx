import {
  Box, Heading, Button, Container,
  Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, VStack
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const previewFaqs = [
  { q: 'How do I book a test?', a: 'You can book a test by selecting a package or individual tests from our website and choosing a time slot at checkout.' },
  { q: 'Can I reschedule my appointment?', a: 'Yes, you can reschedule free of charge up to 24 hours before your scheduled time via the customer care' },
  { q: 'What payment methods do you accept?', a: 'We accept all major payment methods through Razorpay, including credit/debit cards, UPI, net banking, and wallets.' },
  { q: 'When will I get my reports?', a: 'Most reports are delivered to your registered email address within 24-48 hours.' },
];

export const FaqSection = () => {
  return (
    <Container maxW="container.lg" py={20}>
      <VStack spacing={8}>
        <Heading textAlign="center" size="2xl" mb={4}>Frequently Asked Questions</Heading>
        <Accordion allowToggle width="100%">
          {previewFaqs.map((faq, index) => (
            <AccordionItem key={index}>
              <h2>
                <AccordionButton py={5}> 
                  <Box as="span" flex="1" textAlign="left" fontWeight="medium" fontSize="xl"> 
                    {faq.q}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={6} fontSize="lg"> 
                {faq.a}
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
        <Button as={RouterLink} to="/faq" backgroundColor='#384A5C' color="#ffffff" _hover={{backgroundColor:'#D2DEEA', color: '#31373c', borderWidth:'2px', borderColor:'#31373C'}} size="lg">
          View All FAQs
        </Button>
      </VStack>
    </Container>
  );
};