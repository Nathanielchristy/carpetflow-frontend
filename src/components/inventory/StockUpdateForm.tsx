import React, { useState } from 'react';
import { CarpetItem } from '../../types';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface StockUpdateFormProps {
  item: CarpetItem | null;
  onSubmit: (quantity: number, movementType: 'in' | 'out' | 'adjustment', notes?: string) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const StockUpdateForm = ({ item, onSubmit, onCancel, loading = false }: StockUpdateFormProps) => {
  const [movementType, setMovementType] = useState<'in' | 'out' | 'adjustment'>('in');
  const [quantity, setQuantity] = useState(0);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(quantity, movementType, notes);
  };

  if (!item) return null;

  const getNewQuantity = () => {
    switch (movementType) {
      case 'in':
        return item.stockQuantity + quantity;
      case 'out':
        return Math.max(0, item.stockQuantity - quantity);
      case 'adjustment':
        return quantity;
      default:
        return item.stockQuantity;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">{item.name}</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p>Current Stock: <span className="font-medium">{item.stockQuantity} units</span></p>
          <p>Minimum Stock: <span className="font-medium">{item.minimumStock} units</span></p>
          <p>Maximum Stock: <span className="font-medium">{item.maximumStock} units</span></p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Movement Type *
          </label>
          <select
            value={movementType}
            onChange={(e) => setMovementType(e.target.value as 'in' | 'out' | 'adjustment')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="in">Stock In (Add)</option>
            <option value="out">Stock Out (Remove)</option>
            <option value="adjustment">Stock Adjustment (Set to)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {movementType === 'adjustment' ? 'New Quantity *' : 'Quantity *'}
          </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
            required
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder={movementType === 'adjustment' ? 'Enter new stock quantity' : 'Enter quantity to add/remove'}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter reason for stock movement (optional)"
          />
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-medium">New Stock Level:</span> {getNewQuantity()} units
          </p>
          {getNewQuantity() <= item.minimumStock && (
            <p className="text-sm text-red-600 mt-1">
              ⚠️ Warning: New stock level is at or below minimum stock
            </p>
          )}
          {getNewQuantity() > item.maximumStock && (
            <p className="text-sm text-orange-600 mt-1">
              ⚠️ Warning: New stock level exceeds maximum stock
            </p>
          )}
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {loading && <LoadingSpinner size="sm" />}
            <span>Update Stock</span>
          </button>
        </div>
      </form>
    </div>
  );
};