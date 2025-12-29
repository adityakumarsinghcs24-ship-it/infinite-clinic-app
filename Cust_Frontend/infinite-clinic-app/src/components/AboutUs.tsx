import { Container, Heading, Text, Button, Box, Flex, VStack, Divider} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { SafeImage } from './SafeImage';


const longText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Maecenas sed diam eget risus varius blandit sit amet non magna.`;

export const AboutUs = () => {
  return (
    <Box>
      <Container maxW="container.lg" py={{ base: 12, md: 20 }}>
        <Heading 
          as="h5" 
          fontSize="2.5rem" 
          mb={10} 
          textAlign="center" 
          fontWeight="light"
        >
          ABOUT US
        </Heading>
        <Heading
          as="h2"
          size="3xl"
          mb={16}
          textAlign="center"
          fontWeight="extrabold"
        >
          Our story. Forged in the Furnace of Time.
        </Heading>
      </Container>

      <Flex 
        direction={{ base: 'column', md: 'row' }}
        gap={{ base: 10, md: 16 }}
        mb={20}
        align="flex-start"
        bg='#D2DEEA95'
        borderColor='#31373C'
        borderWidth='1px'
        borderRadius='30px'
        py={{ base: 8, md: 12 }}
        px={{ base: 8, md: 12 }}
      >
        <Box flex={{ base: '', md: '1'}}>
          <Heading as="h3" size="xl" mt={8} mb={8} textAlign="center">Our Beginnings</Heading>
          <Divider mb={6} borderColor="#31373C" />
          <VStack spacing={5} align="stretch">
            <Divider></Divider>
            <Text fontSize="lg" textAlign="justify">
              This is the placeholder for the About Us page content. We are 
              dedicated to providing the best diagnostic services with speed 
              and accuracy. Our state-of-the-art facilities and experienced 
              staff ensure that you receive the highest quality care.
            </Text>
            <Text fontSize="lg" textAlign="justify">
              We believe in a patient-first approach, where your comfort and 
              well-being are our top priorities. From the moment you walk in, 
              our team is here to support you.
            </Text>
          </VStack>
        </Box>

        <Box flex={{ base: "1", md: '1.05'}}>
          <VStack spacing={8}>
            <SafeImage
              src="/raikkonen2.avif"
              alt="Our Clinic Interior"
              borderRadius="2xl"
              boxShadow="lg"
              objectFit="cover"
              bg='#ffffff'
            />
          </VStack>
        </Box>
      </Flex>


      <Flex 
        direction={{ base: 'column-reverse', md: 'row' }} 
        gap={{ base: 10}}
        align="center"
        bg='#D2DEEA95'
        borderColor='#31373C'
        borderWidth='1px'
        borderRadius='30px'
        py={{ base: 8, md: 12 }}
        px={{ base: 6, md: 12 }}
        mb={20}
      >
        <Box flex={{ base: '1', md: '1.5' }}>
          <Heading as="h3" size="xl" mb={8} textAlign="center" mt={{ base: 8, md: 0 }}>
            Our Advanced Technology
          </Heading>
          <Divider mb={8} borderColor="#31373C" />
        
          <VStack spacing={5} align="stretch" maxW="container.md" mx="auto">
            <Text
              textAlign="justify"
              fontSize="md">{longText}</Text>
          </VStack>
        </Box>
        
        <Box flex={{base: "1", md: '1'}}>
          <SafeImage
            src="/clinic_temp.jpg"
            alt="Our Expert Team"
            borderRadius="20px"
            boxShadow="lg"
            objectFit="inherit"
            maxW={{ base: '100%', md: '300px' }}
            mx="auto"
          />
        </Box>
      </Flex>
      
      <Container maxW="container.lg" py={{ base: 12, md: 20 }}>
        <Box as="section" mb={20}>
          <Heading as="h3" size="xl" mb={6} textAlign="center">
            Visit Us
          </Heading>
          
          <Box
            as="iframe"
            title="Infinite Diagnostics"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d264.1591033364252!2d73.72182618860232!3d24.618581790154316!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3967e5005d0af097%3A0x672a999271b81d15!2sIndinite%20Diagnostics!5e0!3m2!1sen!2sin!4v1760725734205!5m2!1sen!2sin"
            width="100%"
            height="450px"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            borderRadius="10px"
            boxShadow="md"
          />
        </Box>
        
        <Flex justify="center" mt={10}>
          <Button as={RouterLink} to="/" backgroundColor="#384A5C" color="#ffffff" size="lg">
            Back to Home
          </Button>
        </Flex>
      </Container>
      
    </Box>
  );
};