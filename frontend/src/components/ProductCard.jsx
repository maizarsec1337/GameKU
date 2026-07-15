import React from 'react';
import { Link } from 'react-router-dom';
import ImageWithFallback from './ImageWithFallback';

function ProductCard({ id, name, image, price, category, originalPrice, discount, rating = 5 }) {
  return (
    <Link to={`/product/${id}`} className="product-card" data-category={category}>
      <div className="product-image-wrapper">
        <ImageWithFallback src={image} alt={name} loading="lazy" />
        {discount && (
          <div className="product-badge">{discount}% OFF</div>
        )}
      </div>
      <div className="product-info">
        {category && <span className="product-category">{category}</span>}
        <h3 className="product-name">{name}</h3>
        <div className="product-rating">
          <span className="product-stars">{'★'.repeat(Math.min(Math.round(rating), 5))}{'☆'.repeat(Math.max(0, 5 - Math.min(Math.round(rating), 5)))}</span>
          <span className="product-rating-value">{rating}</span>
        </div>
        {originalPrice && (
          <p className="product-original-price">{originalPrice}</p>
        )}
        <p className="product-price">{price}</p>
        <button className="btn btn-primary btn-sm">Beli</button>
      </div>
    </Link>
  );
}

export default ProductCard;