import React from 'react';
import BadgePlatform from './BadgePlatform';

const ProductCard = React.memo(function ProductCard({ id, name, image, price, category, platform, originalPrice, discount, rating, sold }) {
  return (
    <a 
      href={`/product/${id}`} 
      className="product-card" 
      data-category={category}
    >
      <div className="product-image-wrapper">
        <LazyImage src={image} alt={name} type="product" />
        {discount && (
          <div className="product-badge">{discount}% OFF</div>
        )}
        <BadgePlatform platform={platform} />
      </div>
      <div className="product-info">
        <h3 className="product-name">{name}</h3>
        <div className="product-meta">
          {category && <span className="product-category">{category}</span>}
          {sold && <span className="product-sold">{sold} terjual</span>}
        </div>
        {rating && (
          <div className="product-rating">
            <span className="product-stars">{'★'.repeat(Math.min(Math.round(rating), 5))}{'☆'.repeat(Math.max(0, 5 - Math.min(Math.round(rating), 5)))}</span>
            <span className="product-rating-value">{rating}</span>
          </div>
        )}
        {originalPrice && (
          <p className="product-original-price">{originalPrice}</p>
        )}
        <p className="product-price">{price}</p>
      </div>
    </a>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for re-render optimization
  return (
    prevProps.id === nextProps.id &&
    prevProps.name === nextProps.name &&
    prevProps.image === nextProps.image &&
    prevProps.price === nextProps.price &&
    prevProps.discount === nextProps.discount
  );
});

// LazyImage component with Intersection Observer
const LazyImage = React.memo(({ src, alt, type, className, style }) => {
  const imgRef = React.useRef(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [currentSrc, setCurrentSrc] = React.useState(null);
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && src) {
            setCurrentSrc(src);
            setIsLoaded(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '50px', threshold: 0.01 }
    );

    observer.observe(img);

    return () => observer.disconnect();
  }, [src]);

  const handleError = (e) => {
    if (!hasError) {
      setHasError(true);
      // Use fallback based on type
      const fallbacks = {
        product: '/gambar/product/default.jpg',
        banner: '/gambar/banner/default.jpg',
        avatar: '/gambar/avatar/default.png',
        promo: '/gambar/promo/default.jpg',
        voucher: '/gambar/voucher/default.png',
        default: '/gambar/product/default.jpg'
      };
      setCurrentSrc(fallbacks[type] || fallbacks.default);
    } else {
      e.target.style.visibility = 'hidden';
    }
  };

  return (
    <img
      ref={imgRef}
      src={currentSrc}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      onLoad={(e) => e.target.style.opacity = '1'}
      onError={handleError}
      style={{
        ...style,
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.3s ease'
      }}
    />
  );
});

export default ProductCard;