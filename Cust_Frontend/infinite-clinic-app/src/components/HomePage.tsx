import { Box, VStack } from '@chakra-ui/react';
import { VisualHero } from './VisualHero';
import { CategorySection } from './CategorySection';
import { TrustSection } from './TrustSection';
import { PricingSection } from './PricingSection';
import { FaqSection } from './FaqSection';

export const HomePage = () => {
  return (
    <Box 
      minH="100vh" 
      w="100%" 
      // UPDATED GRADIENT LOGIC:
      // 1. Start with color #1 at 0%
      // 2. Transition to White by 15% (keeps top distinct)
      // 3. Stay White until 85% (keeps middle clean)
      // 4. Transition to color #2 starting at 85% and ending at 100%
      bgGradient="linear(to-b, #02acd22d 0%, #ffffff 15%, #ffffff 96%, #0214d245 100%)"
    >
      <VisualHero />
      <TrustSection />

      <Box pt={20}>
        <VStack spacing={20} align="stretch">
          <Box id="book-a-test" className="section-box">
            <CategorySection />
          </Box>
          
          <Box id="health-plans" className="section-box">
            <PricingSection />
          </Box>
        </VStack>
      </Box>

      <Box id="faq-section" className="section-box" py={20}>
        <FaqSection />
      </Box>
    </Box>
  );
};