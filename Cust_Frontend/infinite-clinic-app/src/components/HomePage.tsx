import { Box, VStack } from '@chakra-ui/react';
import { VisualHero } from './VisualHero';
import { CategorySection } from './CategorySection';
import { TrustSection } from './TrustSection';
import { PricingSection } from './PricingSection';
import { FaqSection } from './FaqSection';


export const HomePage = () => {
  const gridPatternStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage:
      'linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)',
    backgroundSize: '40px 40px',
    maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
    WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
    zIndex: 0, 
  };

  return (
    <>
      <VisualHero />
      <TrustSection />
      <Box position="relative" pt={20}>
        <Box sx={gridPatternStyle} />
        <Box position="relative" zIndex={1}>
          <VStack spacing={20} align="stretch">
            <Box id="book-a-test" className="section-box">
              <CategorySection />
            </Box>
            <Box id="health-plans" className="section-box">
              <PricingSection />
            </Box>
          </VStack>
        </Box>
      </Box>  
      <Box id="faq-section" className="section-box">
        <FaqSection />
      </Box>
    </>
  );
};