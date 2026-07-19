import React, { useState, useEffect, useRef, memo } from 'react';
import assets from '../config/assetConfig';

// Fallback defaults for all types
const FALLBACKS = {
  product: assets.fallback?.product?.file || '/gambar/product/default.jpg',
  banner: assets.fallback?.banner?.file || '/gambar/banner/default.jpg',
  avatar: assets.fallback?.avatar?.file || '/gambar/avatar/default.png',
  promo: assets.fallback?.promo?.file || '/gambar/promo/default.jpg',
  review: assets.fallback?.review?.file || '/gambar/review/default.jpg',
  voucher: assets.fallback?.voucher?.file || '/gambar/voucher/default.png',
  default: '/gambar/product/default.jpg'
};

/**
 * Komponen gambar dengan mekanisme fallback otomatis dan lazy loading.
 * - Lazy loading dengan Intersection Observer
 * - Async decoding
 * - Fallback otomatis jika gambar gagal dimuat
 */
function ImageWithFallback({ src, alt = '', type = 'product', className, style, loading, ...rest }) {
  const imgRef = useRef(null);
  const [currentSrc, setCurrentSrc] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [inView, setInView] = useState(false);
  
  // Get appropriate fallback based on type
  const fallbackImage = FALLBACKS[type] || FALLBACKS.default;
  
  // Determine if src is valid
  const isValidSrc = src && typeof src === 'string' && src.trim() && src !== 'null' && src !== 'undefined';

  // Intersection Observer for lazy loading
  useEffect(() => {
    const img = imgRef.current;
    if (!img || inView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '100px', threshold: 0.01 }
    );

    observer.observe(img);
    return () => observer.disconnect();
  }, [inView, src]);

  // Set source when in view
  useEffect(() => {
    if (inView) {
      setCurrentSrc(isValidSrc ? src : fallbackImage);
    }
  }, [inView, isValidSrc, src, fallbackImage]);

  const handleError = (e) => {
    if (!hasError && currentSrc !== fallbackImage) {
      setHasError(true);
      setCurrentSrc(fallbackImage);
    } else {
      e.target.onerror = null;
      e.target.style.visibility = 'hidden';
    }
  };

  return (
    <img
      ref={imgRef}
      src={currentSrc}
      alt={alt}
      className={className}
      loading={loading || 'lazy'}
      decoding="async"
      style={{
        objectFit: 'cover',
        objectPosition: 'center',
        opacity: inView ? 1 : 0,
        transition: 'opacity 0.2s ease',
        ...style
      }}
      onError={handleError}
      {...rest}
    />
  );
}

export default memo(ImageWithFallback);