import { Image as ChakraImage } from '@chakra-ui/react';
import { useState } from 'react';
import type { ImageProps } from '@chakra-ui/react';

interface SafeImageProps extends ImageProps {
  fallbackSrc?: string;
}

export const SafeImage = ({ src, fallbackSrc, onError, ...props }: SafeImageProps) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!hasError && fallbackSrc) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
    if (onError) {
      onError(e);
    }
  };

  return (
    <ChakraImage
      {...props}
      src={imgSrc}
      onError={handleError}
      loading="lazy"
    />
  );
};