import { Box, Flex, Heading, Button, Link as ChakraLink, VStack, Menu, MenuButton, MenuList, MenuItem} from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Link as ScrollLink } from 'react-scroll';
import { Routes, Route, Link as RouterLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { keepAliveService } from './services/keepAlive';
import { getDisplayUsername } from './utils/userUtils';

import { HomePage } from './components/HomePage';
import { Footer } from './components/Footer';
import { FaqPage } from './components/FaqPage';
import { AboutUs } from './components/AboutUs';
import { TestBookingPage } from './components/TestBookingPage';
import { AuthPage } from './components/AuthPage';
import { TestAPI } from './components/TestAPI';
import { Debug } from './components/Debug';
import { SimpleLogin } from './components/SimpleLogin';
import { BasicTest } from './components/BasicTest';
import { TimeSlotDebug } from './components/TimeSlotDebug';


const Header = () => {
  const location = useLocation();
  const path = location.pathname;
  const { user, logout, isLoggedIn } = useAuth();

  return (
    <Flex as="header" p={4} borderBottomWidth="1px" alignItems="center" position="sticky" top={0} bg="white" zIndex={5} justifyContent="space-between">
      <Heading size="lg" id="logo-destination">
        <ChakraLink as={RouterLink} to="/" _hover={{ textDecoration: 'none' }}>
          Infinite Clinic
        </ChakraLink>
      </Heading>

      <Flex alignItems="center" gap={8}>
        <Flex gap={6} fontWeight="medium" fontSize="md">
          {path === '/' ? (
            <>
              <ScrollLink to="book-a-test" smooth={true} duration={500} offset={-150} style={{ cursor: 'pointer' }}>Book a test</ScrollLink>
              <ScrollLink to="health-plans" smooth={true} duration={500} offset={-30} style={{ cursor: 'pointer' }}>Health plans</ScrollLink>
              
            </>
          ) : (
            <ChakraLink as={RouterLink} to="/" _hover={{ textDecoration: 'none' }}>Home</ChakraLink>
          )}
          

          
          {path !== '/faq' && (
            <ChakraLink as={RouterLink} to="/faq" _hover={{ textDecoration: 'none' }}>
              FAQs
            </ChakraLink>
          )}
          
          {path === '/faq' && (
            <ChakraLink as={RouterLink} to="/AboutUs" _hover={{ textDecoration: 'none' }}>
              About us
            </ChakraLink>
          )}

          {path === '/' && (
            <ChakraLink as={RouterLink} to="/AboutUs" _hover={{ textDecoration: 'none' }}>
              About us
            </ChakraLink>
          )}
        </Flex>
        
        {isLoggedIn ? (
          <Menu>
            <MenuButton as={Button} backgroundColor='#384A5C' color='white' size="md">
              Welcome, {getDisplayUsername(user?.username)}
            </MenuButton>
            <MenuList>
              <MenuItem onClick={logout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        ) : (
          <Button 
            backgroundColor='#384A5C'
            color='white'
            size="md"
            as={RouterLink} 
            to="/login"
            _hover={{
              bg: '#D7EBF0',
              color: 'black',
              borderWidth: '2px',
              borderColor: '#000000'
            }}>
            Log In
          </Button>
        )}
      </Flex>
    </Flex>
  );
};

const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Header />
      <Box as="main" flex="1">{children}</Box>
      <Footer />
    </Box>
  </motion.div>
);

function AppContent() {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const preloaderLogoRef = useRef<HTMLHeadingElement>(null);
  const loadingBarRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    // Start keep-alive service to prevent cold starts
    keepAliveService.start();
    
    // Cleanup on unmount
    return () => {
      keepAliveService.stop();
    };
  }, []);

  useEffect(() => {
    const animationTimeout = setTimeout(() => {
      const destination = document.getElementById('logo-destination');
      if (!preloaderLogoRef.current || !destination || !loadingBarRef.current) return;
      
      gsap.set(preloaderLogoRef.current, { autoAlpha: 0 }); 
      
      const tl = gsap.timeline();
      
      tl
        .to(loadingBarRef.current, { duration: 1.5, width: '100%', ease: 'power2.inOut' })
        .to(preloaderLogoRef.current, { duration: 0.8, autoAlpha: 1 }, "-=0.8")
        .to(preloaderLogoRef.current, {
          duration: 1.5,
          x: destination.getBoundingClientRect().left - preloaderLogoRef.current.getBoundingClientRect().left,
          y: destination.getBoundingClientRect().top - preloaderLogoRef.current.getBoundingClientRect().top,
          fontSize: '1rem', 
          ease: 'power3.inOut',
        }, "+=0.2")
        .to(preloaderRef.current, { 
            duration: 0.8, 
            opacity: 0, 
            onComplete: () => preloaderRef.current?.remove() 
        }, "-=1.2");
    }, 100); 

    return () => clearTimeout(animationTimeout);
  }, []);

  return (
    <>
      <Flex ref={preloaderRef} position="fixed" top="0" left="0" h="100vh" w="100vw" align="center" justify="center" zIndex={100} bg="white">
        <VStack spacing={3}>
            <Heading ref={preloaderLogoRef} size="2xl">
                Infinite Clinic
            </Heading>
            <Box h="4px" w="100%" bg="gray.200" borderRadius="full">
                <Box ref={loadingBarRef} h="100%" w="0%" bg="blue.500" borderRadius="full" />
            </Box>
        </VStack>
      </Flex>
      
      <Box>
        <AnimatePresence 
          mode="wait" 
          onExitComplete={() => window.scrollTo(0, 0)}
        >
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
            <Route path="/faq" element={<MainLayout><FaqPage /></MainLayout>} />
            <Route path="/AboutUs" element={<MainLayout><AboutUs /></MainLayout>} />
            <Route path="/all-tests" element={<MainLayout><TestBookingPage /></MainLayout>} />

            <Route path="/login" element={<AuthPage />} />
            <Route path="/signup" element={<AuthPage />} />
            <Route path="/test-api" element={<TestAPI />} />
            <Route path="/debug" element={<Debug />} />
            <Route path="/time-debug" element={<TimeSlotDebug />} />
            <Route path="/simple-login" element={<SimpleLogin />} />
            <Route path="/basic-test" element={<BasicTest />} />
          </Routes>
        </AnimatePresence>
      </Box>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

