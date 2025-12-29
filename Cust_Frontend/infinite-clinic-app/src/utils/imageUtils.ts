// Utility functions for handling images in production

export const getImageUrl = (path: string): string => {
  // In production, images should be served from the root
  // In development, they're served from the public folder
  const baseUrl = import.meta.env.PROD ? '' : '';
  return `${baseUrl}${path}`;
};

export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
};

export const checkImageExists = async (src: string): Promise<boolean> => {
  try {
    await preloadImage(src);
    return true;
  } catch {
    return false;
  }
};

// Debug function to log image loading status
export const debugImageLoading = () => {
  const images = [
    '/hero-book.PNG',
    '/raikkonen2.avif',
    '/clinic_temp.jpg',
    '/your-doctor-image.png',
    '/vite.svg'
  ];

  console.log('🔍 Debugging image loading...');
  console.log('Environment:', import.meta.env.MODE);
  console.log('Base URL:', import.meta.env.BASE_URL);
  
  images.forEach(async (src) => {
    const exists = await checkImageExists(src);
    console.log(`${exists ? '✅' : '❌'} ${src}`);
  });
};