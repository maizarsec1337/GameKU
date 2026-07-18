import React from 'react';
import BadgePlatform from './BadgePlatform';
import ImageWithFallback from './ImageWithFallback';
 
 function ProductCard({ id, name, image, price, category, platform, originalPrice, discount, rating, sold }) {
   return (
     <a 
       href={`/product/${id}`} 
       className="product-card" 
       data-category={category}
     >
       <div className="product-image-wrapper">
         <ImageWithFallback 
           src={image} 
           alt={name} 
           type="product"
           loading="lazy"
         />
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
 }
 
 export default ProductCard;