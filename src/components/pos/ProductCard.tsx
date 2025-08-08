import React from 'react';
import { CarpetItem } from '../../types';

interface ProductCardProps {
  product: CarpetItem;
  onAddToCart: (product: CarpetItem) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div
      className="border p-4 rounded-lg text-center cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onAddToCart(product)}
    >
      <img src={product.imageUrl || 'https://via.placeholder.com/150'} alt={product.name} className="w-full h-32 object-cover mb-2 rounded" />
      <p className="font-bold">{product.name}</p>
      <p className="text-gray-600">${product.unitPrice.toFixed(2)}</p>
    </div>
  );
};

export default ProductCard;
