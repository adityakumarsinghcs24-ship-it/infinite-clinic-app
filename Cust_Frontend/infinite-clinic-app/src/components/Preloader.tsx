import { Flex, Heading } from '@chakra-ui/react';
import type { RefObject } from 'react';

export const Preloader = ({ logoRef }: { logoRef: RefObject<HTMLHeadingElement> }) => {
  return (
    <Flex h="100vh" align="center" justify="center">
      <Heading ref={logoRef} size="2xl">
        Infinite Clinic
      </Heading>
    </Flex>
  );
};