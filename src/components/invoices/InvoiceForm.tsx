import React, { useState, useEffect } from 'react';
import { Invoice, Customer, CarpetItem } from '../../types';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Plus, Trash2 } from 'lucide-react';

interface InvoiceFormProps {
  invoice?: Invoice | null;
  customers: Customer[];
  inventory: CarpetItem[];
  onSubmit: (data: Partial<Invoice>) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const InvoiceForm = ({ invoice, customers, inventory, onSubmit, onCancel, loading = false }: InvoiceFormProps) => {
  const [formData, setFormData] = useState({
    customer: '',
    status: 'unpaid',
    items: [{ carpet: '', quantity: 1, unitPrice: 0 }],
    notes: ''
  });

  useEffect(() => {
    if (invoice) {
      setFormData({
        customer: invoice.customer.id,
        status: invoice.status,
        items: invoice.items.map(item => ({
          carpet: item.carpet.id,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
        notes: invoice.notes || ''
      });
    }
  }, [invoice]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;

    if (field === 'carpet') {
      const selectedCarpet = inventory.find(inv => inv.id === value);
      if (selectedCarpet) {
        newItems[index].unitPrice = selectedCarpet.unitPrice;
      }
    }

    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { carpet: '', quantity: 1, unitPrice: 0 }]
    }));
  };

  const removeItem = (index: number) => {
    const newItems = [...formData.items];
    newItems.splice(index, 1);
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Customer *
          </label>
          <select
            name="customer"
            value={formData.customer}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select customer</option>
            {customers.map(customer => (
              <option key={customer.id} value={customer.id}>{customer.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status *
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="unpaid">Unpaid</option>
            <option value="paid">Paid</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Items</h3>
        <div className="space-y-4">
          {formData.items.map((item, index) => (
            <div key={index} className="flex items-center space-x-4">
              <select
                value={item.carpet}
                onChange={(e) => handleItemChange(index, 'carpet', e.target.value)}
                required
                className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select carpet</option>
                {inventory.map(invItem => (
                  <option key={invItem.id} value={invItem.id}>{invItem.name}</option>
                ))}
              </select>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                required
                min="1"
                className="w-1/4 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="number"
                value={item.unitPrice}
                onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                required
                min="0"
                step="0.01"
                className="w-1/4 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="text-red-600 hover:text-red-900"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addItem}
          className="mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2 inline" />
          Add Item
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter any notes for the invoice"
        />
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
          <span>{invoice ? 'Update' : 'Create'} Invoice</span>
        </button>
      </div>
    </form>
  );
};
