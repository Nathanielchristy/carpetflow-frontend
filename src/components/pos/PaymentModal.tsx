import React, { useState } from 'react';
import { CartItemType } from './CartItem';

export interface PaymentDetails {
  customerName: string;
  paymentMethod: string;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItemType[];
  total: number;
  onSubmit: (paymentDetails: PaymentDetails) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, cart, total, onSubmit }) => {
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit({
      customerName,
      paymentMethod,
      items: cart,
      total,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-1/3">
        <h2 className="text-2xl font-bold mb-4">Checkout</h2>

        <div className="mb-4">
          <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">Customer Name</label>
          <input
            type="text"
            id="customerName"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">Payment Method</label>
          <select
            id="paymentMethod"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option>Cash</option>
            <option>Credit Card</option>
          </select>
        </div>

        <div className="border-t pt-4 mt-4">
          <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
          {cart.map(item => (
            <div key={item.product.id} className="flex justify-between text-sm">
              <span>{item.product.name} x {item.quantity}</span>
              <span>${(item.product.unitPrice * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold text-xl mt-2">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-md">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded-md">Confirm Payment</button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
