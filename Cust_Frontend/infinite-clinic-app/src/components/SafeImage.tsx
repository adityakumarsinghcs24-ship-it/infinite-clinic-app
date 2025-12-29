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
    console.log(`❌ Image failed to load: ${imgSrc}`);
    if (!hasError && fallbackSrc) {
      setHasError(true);
      setImgSrc(fallbackSrc);
      console.log(`🔄 Trying fallback: ${fallbackSrc}`);
    }
    if (onError) {
      onError(e);
    }
  };

  const handleLoad = () => {
    console.log(`✅ Image loaded successfully: ${imgSrc}`);
  };

  return (
    <ChakraImage
      {...props}
      src={imgSrc}
      onError={handleError}
      onLoad={handleLoad}
      loading="lazy"
    />
  );
};