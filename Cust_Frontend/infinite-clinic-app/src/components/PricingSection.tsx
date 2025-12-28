import { Container, Flex, Heading, Text, VStack } from '@chakra-ui/react';
import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { PricingCard } from './PricingCard';

const plans = [
    { name: 'Basic Wellness', price: '900', features: ['Sugar Fasting', 'Thyroid Profile', 'Lipid Profile Screen', 'LFT/KFT'], popular: false },
    { name: 'Advanced Checkup', price: '1400', features: ['All Basic Tests', 'CBC', 'HbA1c', 'Urine Routine'], popular: false },
    { name: 'Comprehensive Scan', price: '1700', features: ['All Advanced Tests', 'ESR', 'Vitamin B12'], popular: true },
    { name: 'Vitamin & Mineral Focus', price: '2000', features: ['All Comprehensive Tests', 'Vitamin D3'], popular: false },
    { name: 'Total Health Package', price: '3000', features: ['Includes All Tests Available'], popular: false },
];

export const PricingSection = () => {
  const [activeCard, setActiveCard] = useState(() => {
    return plans.find(p => p.popular)?.name || null;
  });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const cards = gsap.utils.toArray('.pricing-card');

    cards.forEach((card: any) => {
      if (card.id === activeCard) {
        gsap.to(card, {
          scale: 1.05,
          y: -15,
          opacity: 1,
          boxShadow: '0 0 40px 10px rgba(59, 130, 246, 0.4)',
          duration: 0.4,
          ease: 'power3.out',
        });
      } else {
        gsap.to(card, {
          scale: 0.9,
          y: 0,
          opacity: 0.6,
          boxShadow: 'none',
          duration: 0.4,
          ease: 'power3.out',
        });
      }
    });
  }, [activeCard]);

  return (
    <Container maxW="container.xxl" py={20}>
      <VStack spacing={4} textAlign="center" mb={10}>
        <Heading size="3xl">Flexible Plans for Your Health</Heading>
        <Text fontSize="xl" color="#31373C">
          Choose a package that's right for you. All prices are transparent and affordable.
        </Text>
      </VStack>
      <Flex
        ref={containerRef}
        direction={{ base: 'column', lg: 'row' }}
        justify="center"
        align={{ base: 'center', lg: 'stretch' }}
        gap={8}
      >
        {plans.map((plan) => (
          <PricingCard
            key={plan.name}
            id={plan.name}
            plan={plan}
            isActive={plan.name === activeCard}
            onMouseEnter={() => setActiveCard(plan.name)}
          />
        ))}
      </Flex>
    </Container>
  );
};