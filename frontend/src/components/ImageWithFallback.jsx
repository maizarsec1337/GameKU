import React, { useState } from 'react';
import assets from '../config/assetConfig';

// Fallback defaults for all types
const FALLBACKS = {
  product: assets.fallback.product.file,
  banner: assets.fallback.banner.file,
  avatar: assets.fallback.avatar.file,
  promo: assets.fallback.promo.file,
  review: assets.fallback.review.file,
  voucher: assets.fallback.voucher.file,
  default: assets.fallback.product.file
};

/**
 * Komponen gambar dengan mekanisme fallback otomatis.
 * Jika src kosong (null/undefined), gagal dimuat, atau 404,
 * maka otomatis menampilkan fallback image sesuai tipe.
 */
function ImageWithFallback({ src, alt = '', type = 'product', className, style, loading, ...rest }) {
  // Get appropriate fallback based on type
  const fallbackImage = FALLBACKS[type] || FALLBACKS.default;
  
  // Determine if src is valid (has value and is not empty/placeholder)
  const isValidSrc = src && typeof src === 'string' && src.trim() && src !== 'null' && src !== 'undefined';
  
  const [currentSrc, setCurrentSrc] = useState(isValidSrc ? src : fallbackImage);
  const [hasError, setHasError] = useState(false);

  const handleError = (e) => {
    // If we haven't already tried fallback
    if (!hasError && currentSrc !== fallbackImage) {
      setHasError(true);
      setCurrentSrc(fallbackImage);
    } else {
      // Fallback also failed: hide broken image icon
      e.target.onerror = null;
      e.target.style.visibility = 'hidden';
    }
  };

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      loading={loading || 'lazy'}
      style={{
        objectFit: 'cover',
        objectPosition: 'center',
        ...style
      }}
      onError={handleError}
      {...rest}
    />
  );
}

export default ImageWithFallback;