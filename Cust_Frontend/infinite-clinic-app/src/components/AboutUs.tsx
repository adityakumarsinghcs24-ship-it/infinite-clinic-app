import React from 'react';
import { 
  Container, 
  Heading, 
  Text, 
  Button, 
  Box, 
  Flex, 
  VStack, 
  Divider, 
  Icon, 
  useColorModeValue
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaMapMarkedAlt, FaArrowLeft } from 'react-icons/fa';
import { SafeImage } from './SafeImage';
import raikkonenImg from '../assets/raikkonen2.avif';
import clinicTempImg from '../assets/clinic_temp.jpg';

// Reusing the brand colors defined in AuthPage
const BRAND_DARK = "#384A5C";
const BRAND_LIGHT = "#D2DEEA";
const BG_GRADIENT_LIGHT = "linear(to-b, #e3eaf2ff, #f7fafc)";

// Motion component for smooth entry animations like AuthPage
const MotionBox = motion(Box);

const longText = `At Infinite Clinic, we believe that an accurate diagnosis is the foundation of effective treatment. That is why we have invested heavily in state-of-the-art diagnostic equipment that rivals the largest hospitals in the country. From high-resolution imaging to fully automated pathology systems, our laboratory utilizes the latest medical technology to ensure that every result we provide is precise, reliable, and delivered with speed. We know that waiting for results can be anxious, which is why our streamlined processes focus on getting you answers as quickly as possible without cutting corners.

However, we also know that technology is only as effective as the people behind it. Our advanced machinery is operated by a team of highly experienced doctors and senior technicians who bring decades of combined expertise to the lab. Every test is monitored, and every result is verified by a specialist. We combine this clinical excellence with a philosophy of care—ensuring that while our equipment is high-tech, our approach remains high-touch. We bring world-class diagnostics right to your neighborhood so that you have access to the best healthcare tools available, without the need to travel far from home.`;

export const AboutUs = () => {
  const cardBg = useColorModeValue('white', 'gray.800');

  return (
    <Box 
      bgGradient={BG_GRADIENT_LIGHT} 
      minH="100vh" 
      position="relative" 
      overflow="hidden"
    >
      {/* --- DECORATIVE BACKGROUND BLOBS (Matches AuthPage/TrustSection) --- */}
      <Box
        position="absolute"
        top="-10%"
        right="-5%"
        w="500px"
        h="500px"
        bg={BRAND_LIGHT}
        opacity={0.4}
        filter="blur(80px)"
        borderRadius="full"
        zIndex={0}
      />
      <Box
        position="absolute"
        bottom="10%"
        left="-10%"
        w="400px"
        h="400px"
        bg="#CFE4DE"
        opacity={0.5}
        filter="blur(100px)"
        borderRadius="full"
        zIndex={0}
      />

      {/* --- HERO SECTION --- */}
      <Container maxW="container.xl" py={{ base: 12, md: 20 }} position="relative" zIndex={1}>
        <VStack spacing={2} mb={16}>
          {/* UPDATED: Larger text, no pill background */}
          <Text 
            fontSize="xl" 
            fontWeight="bold" 
            color={BRAND_DARK} 
            letterSpacing="widest"
            textTransform="uppercase"
            mb={2}
          >
            ABOUT US
          </Text>
          <Heading
            as="h2"
            size="3xl"
            textAlign="center"
            fontWeight="extrabold"
            color={BRAND_DARK}
            lineHeight="1.2"
          >
            Our story.<br />
            <Text as="span" bgGradient={`linear(to-r, ${BRAND_DARK}, #5C7C99)`} bgClip="text">
              Forged in the Furnace of Time.
            </Text>
          </Heading>
        </VStack>

        {/* --- SECTION 1: ORIGINS --- */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Flex 
            direction={{ base: 'column', md: 'row' }}
            gap={{ base: 10, md: 16 }}
            align="center"
            bg={cardBg}
            borderRadius="2xl"
            boxShadow="xl"
            p={{ base: 8, md: 12 }}
            mb={20}
            border="1px solid"
            borderColor="gray.100"
          >
            <Box flex="1">
              <VStack align="start" spacing={6}>
                {/* UPDATED: Icon removed */}
                <Heading as="h3" size="xl" color={BRAND_DARK}>Our Beginnings</Heading>
                
                <Divider borderColor={BRAND_LIGHT} borderWidth="2px" w="100px" opacity={0.5} />
                
                <Text fontSize="lg" color="gray.600" lineHeight="1.8">
                  Infinite Clinic is proud to be a truly homegrown laboratory.
                  We didn't start in a corporate boardroom; we started right here,
                  in the heart of this community, with a wish to serve our neighbors.
                  Over the years, while our facility has grown, our core team has remained
                  the same.
                </Text>
                <Text fontSize="lg" color="gray.600" lineHeight="1.8">
                  The familiar faces that welcomed our very first patients are 
                  still here today, dedicated to the continuity of your care. 
                  We treat you like family because, to us,
                  you are more than just a patient ID number—you are a part of the 
                  community we love.
                </Text>
                <Text fontSize="lg" color="gray.600" lineHeight="1.8" fontStyle="italic">
                  "Our mission has always been to make high-quality healthcare accessible to everyone."
                </Text>
              </VStack>
            </Box>

            <Box flex="1" w="full">
              <Box 
                position="relative" 
                borderRadius="2xl" 
                overflow="hidden" 
                boxShadow="2xl"
                maxH="500px"
              >
                 {/* Image Overlay Gradient */}
                <Box 
                  position="absolute" 
                  inset={0} 
                  bgGradient="linear(to-t, rgba(56, 74, 92, 0.4), transparent)" 
                  zIndex={1} 
                />
                <SafeImage
                  src={raikkonenImg}
                  alt="Our Clinic Beginnings"
                  objectFit="cover"
                  w="100%"
                  h="100%"
                />
              </Box>
            </Box>
          </Flex>
        </MotionBox>

        {/* --- SECTION 2: TECHNOLOGY (Reversed) --- */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Flex 
            direction={{ base: 'column-reverse', md: 'row' }} 
            gap={{ base: 10, md: 16 }}
            align="center"
            bg={cardBg}
            borderRadius="2xl"
            boxShadow="xl"
            p={{ base: 8, md: 12 }}
            mb={20}
            border="1px solid"
            borderColor="gray.100"
          >
            <Box flex="1" w="full">
               <Box 
                position="relative" 
                borderRadius="2xl" 
                overflow="hidden" 
                boxShadow="2xl"
                maxW={{ base: '100%', md: '400px' }}
                mx="auto"
              >
                <SafeImage
                  src={clinicTempImg}
                  alt="Our Expert Team"
                  objectFit="cover"
                  w="100%"
                />
              </Box>
            </Box>

            <Box flex="1.2">
              <VStack align="start" spacing={6}>
                {/* UPDATED: Icon removed */}
                <Heading as="h3" size="xl" color={BRAND_DARK}>Advanced Technology</Heading>

                <Divider borderColor={BRAND_LIGHT} borderWidth="2px" w="100px" opacity={0.5} />

                <Text fontSize="md" color="gray.600" lineHeight="1.8" textAlign="justify">
                  {longText}
                </Text>
              </VStack>
            </Box>
          </Flex>
        </MotionBox>

        {/* --- SECTION 3: LOCATION --- */}
        <MotionBox
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Box 
            textAlign="center" 
            mb={10}
            bg={cardBg}
            p={8}
            borderRadius="2xl"
            boxShadow="lg"
          >
            {/* Kept Icon here as requested */}
            <Flex justify="center" align="center" gap={3} mb={6}>
               <Icon as={FaMapMarkedAlt} color={BRAND_DARK} boxSize={6} />
               <Heading as="h3" size="xl" color={BRAND_DARK}>
                Visit Us
              </Heading>
            </Flex>
           
            <Box
              w="100%"
              h="450px"
              borderRadius="xl"
              overflow="hidden"
              boxShadow="inner"
              border="4px solid"
              borderColor="#f0f0f0"
            >
              <Box
                as="iframe"
                title="Infinite Diagnostics"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d264.1591033364252!2d73.72182618860232!3d24.618581790154316!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3967e5005d0af097%3A0x672a999271b81d15!2sIndinite%20Diagnostics!5e0!3m2!1sen!2sin!4v1760725734205!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
              />
            </Box>
          </Box>
        </MotionBox>
        
        {/* --- FOOTER CTA --- */}
        <Flex justify="center" mt={10}>
          <Button 
            as={RouterLink} 
            to="/" 
            backgroundColor={BRAND_DARK} 
            color="#ffffff" 
            size="lg"
            h="56px"
            px={10}
            leftIcon={<FaArrowLeft />}
            borderRadius="full"
            border="1px solid"
            borderColor="transparent" // Default invisible border to prevent layout shift
            _hover={{ 
              bg: BRAND_LIGHT, 
              color: BRAND_DARK,
              transform: 'translateY(-2px)',
              boxShadow: 'lg',
              borderColor: BRAND_DARK // UPDATED: Border color matches text on hover
            }}
            transition="all 0.3s"
          >
            Back to Home
          </Button>
        </Flex>

      </Container>
    </Box>
  );
};