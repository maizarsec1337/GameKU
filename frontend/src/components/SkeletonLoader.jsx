import React from 'react';

// Skeleton Loading Components
// Ganti loading text dengan skeleton yang lebih baik

const SkeletonBanner = ({ count = 1 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="skeleton-banner">
        <div className="skeleton-banner-shimmer" />
      </div>
    ))}
  </>
);

const SkeletonCategory = ({ count = 8 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="skeleton-category">
        <div className="skeleton-category-icon" />
        <div className="skeleton-category-text" />
      </div>
    ))}
  </>
);

const SkeletonProductCard = ({ count = 6 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="skeleton-product-card">
        <div className="skeleton-product-image" />
        <div className="skeleton-product-info">
          <div className="skeleton-product-name" />
          <div className="skeleton-product-price" />
        </div>
      </div>
    ))}
  </>
);

const SkeletonPromo = ({ count = 3 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="skeleton-promo">
        <div className="skeleton-promo-shimmer" />
      </div>
    ))}
  </>
);

export {
  SkeletonBanner,
  SkeletonCategory,
  SkeletonProductCard,
  SkeletonPromo
};

export default SkeletonBanner;