import {  extendTheme } from '@chakra-ui/react';


const theme = extendTheme({
  fonts: {
    heading: `'Montserrat', sans-serif`,
    body: `'Roboto', sans-serif`,
  },
  styles: {
    global: {
      body: {
        fontSize: '1.1rem',
        color: 'gray.700',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: 'full',
        fontWeight: 'semibold',
        color: "#ffffff",
        transition: 'all 0.2s ease-in-out',
        background: "#384A5C"

        
      },
      
      sizes: {
        lg: {
          px: '8',
          fontSize: 'lg',
        },
      },


    },
    Heading: {
      sizes: {
        '4xl': { fontSize: ['4.5rem', null, '6rem'], lineHeight: '1.1' },
        '3xl': { fontSize: ['3rem', null, '3.75rem'], lineHeight: '1.2' },
      },
    },
  },
});

export default theme; 