import React, { useState } from 'react';
import { Plus, Search, Filter, Package, AlertTriangle, Edit, Trash2, Eye } from 'lucide-react';
import { useInventory, useCreateCarpetItem, useUpdateCarpetItem, useUpdateStock } from '../../hooks/useApi';
import { useAuth } from '../../hooks/useAuth';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { Modal } from '../common/Modal';
import { Pagination } from '../common/Pagination';
import { CarpetItem } from '../../types';
import { InventoryForm } from './InventoryForm';
import { StockUpdateForm } from './StockUpdateForm';

export const InventoryManagement = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showStockForm, setShowStockForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CarpetItem | null>(null);

  const { data: inventoryData, loading, error, refetch } = useInventory({
    page: currentPage,
    limit: 10,
    search: searchTerm,
    filters: filterType !== 'all' ? { type: filterType } : undefined
  });

  const { createCarpetItem, loading: createLoading } = useCreateCarpetItem();
  const { updateCarpetItem, loading: updateLoading } = useUpdateCarpetItem();
  const { updateStock, loading: stockLoading } = useUpdateStock();

  const carpetTypes = ['All', 'Persian', 'Turkish', 'Shaggy', 'Modern', 'Oriental'];
  const canEdit = user?.role === 'admin' || user?.role === 'warehouse';

  const handleCreateItem = async (itemData: Partial<CarpetItem>) => {
    try {
      await createCarpetItem({
        ...itemData,
        location: user?.location === 'all' ? 'dubai' : user?.location,
        createdBy: user?.id
      });
      setShowAddForm(false);
      refetch();
    } catch (error) {
      console.error('Error creating item:', error);
    }
  };

  const handleUpdateItem = async (itemData: Partial<CarpetItem>) => {
    if (!selectedItem) return;
    
    try {
      await updateCarpetItem(selectedItem.id, itemData);
      setShowEditForm(false);
      setSelectedItem(null);
      refetch();
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleStockUpdate = async (quantity: number, movementType: 'in' | 'out' | 'adjustment', notes?: string) => {
    if (!selectedItem) return;
    
    try {
      await updateStock(selectedItem.id, quantity, movementType, notes);
      setShowStockForm(false);
      setSelectedItem(null);
      refetch();
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorMessage message={error} onRetry={refetch} />
      </div>
    );
  }

  const inventory = inventoryData?.data || [];
  const lowStockItems = inventory.filter(item => item.stockQuantity <= item.minimumStock);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600 mt-1">
            Manage your carpet inventory and track stock levels
          </p>
        </div>
        {canEdit && (
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Item</span>
          </button>
        )}
      </div>

      {lowStockItems.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h3 className="text-lg font-semibold text-red-800">Low Stock Alert</h3>
          </div>
          <p className="text-red-700">
            {lowStockItems.length} item(s) are running low on stock: {lowStockItems.map(item => item.name).join(', ')}
          </p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {carpetTypes.map((type) => (
                <option key={type} value={type.toLowerCase()}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type & Material
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inventory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                          <Package className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.barcode} • {item.size}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.type}</div>
                    <div className="text-sm text-gray-500">{item.material} • {item.color}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {item.stockQuantity} units
                    </div>
                    <div className={`text-sm ${item.stockQuantity <= item.minimumStock ? 'text-red-600' : 'text-gray-500'}`}>
                      Min: {item.minimumStock}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${item.unitPrice.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">Cost: ${item.costPrice.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                      {item.location}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setSelectedItem(item)}
                        className="text-gray-600 hover:text-blue-600"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {canEdit && (
                        <>
                          <button 
                            onClick={() => {
                              setSelectedItem(item);
                              setShowEditForm(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit Item"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedItem(item);
                              setShowStockForm(true);
                            }}
                            className="text-green-600 hover:text-green-900"
                            title="Update Stock"
                          >
                            <Package className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {inventoryData && (
          <Pagination
            currentPage={currentPage}
            totalPages={inventoryData.totalPages}
            onPageChange={setCurrentPage}
            totalItems={inventoryData.total}
            itemsPerPage={inventoryData.limit}
          />
        )}

        {inventory.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">No inventory items found</div>
          </div>
        )}
      </div>

      {/* Add Item Modal */}
      <Modal
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        title="Add New Carpet Item"
        size="lg"
      >
        <InventoryForm
          onSubmit={handleCreateItem}
          onCancel={() => setShowAddForm(false)}
          loading={createLoading}
        />
      </Modal>

      {/* Edit Item Modal */}
      <Modal
        isOpen={showEditForm}
        onClose={() => {
          setShowEditForm(false);
          setSelectedItem(null);
        }}
        title="Edit Carpet Item"
        size="lg"
      >
        <InventoryForm
          item={selectedItem}
          onSubmit={handleUpdateItem}
          onCancel={() => {
            setShowEditForm(false);
            setSelectedItem(null);
          }}
          loading={updateLoading}
        />
      </Modal>

      {/* Stock Update Modal */}
      <Modal
        isOpen={showStockForm}
        onClose={() => {
          setShowStockForm(false);
          setSelectedItem(null);
        }}
        title="Update Stock"
        size="md"
      >
        <StockUpdateForm
          item={selectedItem}
          onSubmit={handleStockUpdate}
          onCancel={() => {
            setShowStockForm(false);
            setSelectedItem(null);
          }}
          loading={stockLoading}
        />
      </Modal>
    </div>
  );
};