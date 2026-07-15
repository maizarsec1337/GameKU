import React, { useState } from 'react';
import assets from '../config/assetConfig';

// Fallback default untuk seluruh card di website
const FALLBACK = assets.fallback.product.file;

/**
 * Komponen gambar dengan mekanisme fallback otomatis.
 * Jika src kosong (null/undefined), gagal dimuat, atau 404,
 * maka otomatis menampilkan Gcard.png sesuai aturan fallback.
 */
function ImageWithFallback({ src, alt = '', className, style, loading, ...rest }) {
  // Jika src tidak valid (kosong/null/undefined), langsung gunakan fallback
  const [currentSrc, setCurrentSrc] = useState(
    src && typeof src === 'string' && src.trim() ? src : FALLBACK
  );

  const handleError = (e) => {
    // Hindari loop tak terbatas jika fallback itu sendiri gagal
    if (currentSrc !== FALLBACK) {
      setCurrentSrc(FALLBACK);
    } else {
      // Fallback juga gagal: cegah browser menampilkan icon rusak
      e.target.onerror = null;
      e.target.style.visibility = 'hidden';
    }
  };

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      loading={loading}
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