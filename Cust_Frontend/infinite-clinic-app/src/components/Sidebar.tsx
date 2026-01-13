import { Box, VStack, Icon, Text, Flex, Link } from '@chakra-ui/react';
import { FaHome, FaFileMedical, FaCalendarAlt, FaUserCog, FaSignOutAlt } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';

const NavItem = ({ icon, children, to, isActive }: any) => {
  return (
    <Link as={RouterLink} to={to} style={{ textDecoration: 'none' }} w="100%">
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        bg={isActive ? '#384A5C' : 'transparent'}
        color={isActive ? 'white' : 'gray.600'}
        _hover={{
          bg: '#384A5C',
          color: 'white',
        }}
        transition="all 0.2s"
      >
        <Icon
          mr="4"
          fontSize="16"
          _groupHover={{ color: 'white' }}
          as={icon}
        />
        <Text fontSize="md" fontWeight="medium">{children}</Text>
      </Flex>
    </Link>
  );
};

export const Sidebar = () => {
  return (
    <Box
      w={{ base: 'full', md: 60 }}
      h="100vh"
      bg="white"
      borderRight="1px"
      borderRightColor="gray.200"
      pos="fixed" // Keeps sidebar fixed while content scrolls
      py={8}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between" mb={6}>
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold" color="#384A5C">
          InfiniteClinic
        </Text>
      </Flex>
      
      <VStack spacing={2} align="stretch">
        <NavItem icon={FaHome} to="/dashboard" isActive={true}>Overview</NavItem>
        <NavItem icon={FaCalendarAlt} to="/appointments">Appointments</NavItem>
        <NavItem icon={FaFileMedical} to="/reports">My Reports</NavItem>
        <NavItem icon={FaUserCog} to="/settings">Settings</NavItem>
        
        <Box pt={10}>
             <NavItem icon={FaSignOutAlt} to="/logout">Sign Out</NavItem>
        </Box>
      </VStack>
    </Box>
  );
};