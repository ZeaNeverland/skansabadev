import { ImgHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

type ImageProps = {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  loading?: 'eager' | 'lazy';
  quality?: number;
  priority?: boolean;
  fill?: boolean;
} & ImgHTMLAttributes<HTMLImageElement>;

const Image = forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      src,
      alt,
      width,
      height,
      className,
      loading = 'lazy',
      quality = 75,
      priority = false,
      fill = false,
      ...props
    },
    ref
  ) => {
    // In development, use the image as is
    // In production, Vite will handle the optimization
    const optimizedSrc = src.startsWith('http')
      ? src
      : src.startsWith('/')
      ? src
      : `/src/${src}`;

    return (
      <img
        ref={ref}
        src={optimizedSrc}
        alt={alt}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        loading={priority ? 'eager' : loading}
        className={cn(
          'transition-all duration-300',
          fill ? 'w-full h-full object-cover' : 'object-cover',
          className
        )}
        style={fill ? { position: 'absolute', inset: 0 } : undefined}
        {...props}
      />
    );
  }
);

Image.displayName = 'Image';

export { Image };
