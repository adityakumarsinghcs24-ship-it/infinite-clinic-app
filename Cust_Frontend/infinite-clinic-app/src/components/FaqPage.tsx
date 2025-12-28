import {
  Box, Container, Heading, Button,
  Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const allFaqs = [
  { q: 'How do I book a test?', a: 'You can book a test by selecting a package or individual tests from our website. After adding them to your cart, proceed to checkout to select a time slot for sample collection.' },
  { q: 'Can I book a test for someone else?', a: 'Yes, during the booking process, you will be asked to provide the patient\'s details, which can be different from your own.' },
  { q: 'Can I reschedule my appointment?', a: 'Yes, you can reschedule your appointment free of charge up to 24 hours before your scheduled time slot via the link in your confirmation email or by contacting support.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major payment methods through Razorpay, including credit/debit cards, UPI (GPay, PhonePe, etc.), net banking, and various wallets.' },
  { q: 'Is it safe to pay online?', a: 'Yes, all transactions are processed through Razorpay, a secure and PCI DSS compliant payment gateway. We do not store any of your card or bank details.' },
  { q: 'What is your refund/cancellation policy?', a: 'You can cancel up to 24 hours before your scheduled slot for a full refund, processed within 5-7 business days.' },
  { q: 'Is home sample collection available in my area?', a: 'We offer home sample collection across Udaipur. You can contact customer support for conformation' },
  { q: 'When will I get my reports?', a: 'Most reports are delivered to your email within 24-48 hours. You will be notified once your report is ready.' },
];

export const FaqPage = () => {
  return (
    <Container maxW="container.lg" py={20}>
      <Heading mb={10} textAlign="center">Frequently Asked Questions</Heading>
      <Accordion allowToggle>
        {allFaqs.map((faq, index) => (
          <AccordionItem key={index}>
            <h2>
              <AccordionButton py={4}>
                <Box as="span" flex="1" textAlign="left" fontWeight="medium">
                  {faq.q}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              {faq.a}
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
      <Button as={RouterLink} to="/"
      color='#ffffff' 
            backgroundColor='#384A5C'
                            _hover={{
                  bg: '#D2DEEA',
                  color: 'black',
                  borderWidth: '2px',
                  borderColor: '#000000'
                }} mt={10}>
        Back to Home
      </Button>
    </Container>
  );
};