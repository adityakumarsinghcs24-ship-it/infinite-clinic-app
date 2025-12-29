import { Image as ChakraImage, type ImageProps } from '@chakra-ui/react';
import { useState } from 'react';

interface SafeImageProps extends ImageProps {
  fallbackSrc?: string;
}

export const SafeImage = ({ src, fallbackSrc, onError, ...props }: SafeImageProps) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = (e: any) => {
    if (!hasError && fallbackSrc) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
    onError?.(e);
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