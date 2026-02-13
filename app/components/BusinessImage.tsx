
import Image from 'next/image';
import { useState } from 'react';

interface BusinessImageProps {
  src?: string | null;
  alt: string;
  className?: string;
}

export default function BusinessImage({ src, alt, className }: BusinessImageProps) {
 
  const fallbackImage = "/images/store.png";
  const [imgSrc, setImgSrc] = useState(src || fallbackImage);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      
      onError={() => setImgSrc(fallbackImage)}
    />
  );
}