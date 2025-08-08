import React from 'react';
import { CarpetItem } from '../../types';

export interface CartItemType {
  product: CarpetItem;
  quantity: number;
}

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemoveFromCart }) => {
  const handleQuantityChange = (change: number) => {
    const newQuantity = item.quantity + change;
    if (newQuantity > 0) {
      onUpdateQuantity(item.product.id, newQuantity);
    } else {
      onRemoveFromCart(item.product.id);
    }
  };

  return (
    <div className="flex justify-between items-center p-2 border-b">
      <div>
        <p className="font-semibold">{item.product.name}</p>
        <p className="text-sm text-gray-500">${item.product.unitPrice.toFixed(2)}</p>
      </div>
      <div className="flex items-center">
        <button onClick={() => handleQuantityChange(-1)} className="px-2 py-1 border rounded">-</button>
        <p className="px-3">{item.quantity}</p>
        <button onClick={() => handleQuantityChange(1)} className="px-2 py-1 border rounded">+</button>
      </div>
      <p className="font-semibold">${(item.product.unitPrice * item.quantity).toFixed(2)}</p>
      <button onClick={() => onRemoveFromCart(item.product.id)} className="ml-2 text-red-500 hover:text-red-700">
        &times;
      </button>
    </div>
  );
};

export default CartItem;
