import React, { useState } from 'react';
import { BarChart3, TrendingUp, Download, Calendar, DollarSign, Package, Users, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const Reports = () => {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState('sales');

  const reportTypes = [
    { id: 'sales', label: 'Sales Report', icon: DollarSign, roles: ['admin', 'salesperson', 'accountant'] },
    { id: 'inventory', label: 'Inventory Report', icon: Package, roles: ['admin', 'warehouse'] },
    { id: 'customers', label: 'Customer Report', icon: Users, roles: ['admin', 'salesperson', 'accountant'] },
    { id: 'lowstock', label: 'Low Stock Report', icon: AlertTriangle, roles: ['admin', 'warehouse'] }
  ];

  const availableReports = reportTypes.filter(report => 
    report.roles.includes(user?.role || '')
  );

  const periods = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const getSalesData = () => {
    return {
      totalRevenue: 145250,
      totalOrders: 89,
      averageOrderValue: 1632,
      growthRate: 12.5,
      topProducts: [
        { name: 'Persian Royal Blue', sales: 25, revenue: 30000 },
        { name: 'Turkish Kilim Red', sales: 18, revenue: 14400 },
        { name: 'Modern Shaggy Grey', sales: 22, revenue: 9900 }
      ]
    };
  };

  const getInventoryData = () => {
    return {
      totalItems: 245,
      totalValue: 287500,
      lowStockItems: 12,
      outOfStock: 3,
      categories: [
        { name: 'Persian', count: 85, value: 102000 },
        { name: 'Turkish', count: 67, value: 89400 },
        { name: 'Modern', count: 93, value: 96100 }
      ]
    };
  };

  const getCustomerData = () => {
    return [
      { name: 'Arabian Carpets LLC', email: 'contact@arabiancarpets.ae', location: 'dubai', totalOrders: 5 },
      { name: 'Desert Home Furnishing', email: 'sales@deserthome.ae', location: 'abu-dhabi', totalOrders: 3 },
      { name: 'Emirates Interior Design', email: 'info@emiratesid.com', location: 'dubai', totalOrders: 2 },
      { name: 'Royal Palace Decor', email: 'orders@royalpalace.ae', location: 'dubai', totalOrders: 4 },
    ];
  };

  const getLowStockData = () => {
    return [
      { product: 'Turkish Kilim Red', location: 'dubai', stock: 3, minStock: 5 },
      { product: 'Vintage Oriental Gold', location: 'dubai', stock: 2, minStock: 3 },
      { product: 'Modern Shaggy Grey', location: 'abu-dhabi', stock: 4, minStock: 8 },
    ];
  };

  const salesData = getSalesData();
  const inventoryData = getInventoryData();
  const customerData = getCustomerData();
  const lowStockData = getLowStockData();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">
            Analyze your business performance and trends
          </p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
          <Download className="h-4 w-4" />
          <span>Export Report</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Type</h3>
            <div className="space-y-2">
              {availableReports.map((report) => {
                const Icon = report.icon;
                return (
                  <button
                    key={report.id}
                    onClick={() => setSelectedReport(report.id)}
                    className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                      selectedReport === report.id
                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {report.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Time Period</h4>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {periods.map((period) => (
                  <option key={period.value} value={period.value}>
                    {period.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          {selectedReport === 'sales' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">${salesData.totalRevenue.toLocaleString()}</p>
                    </div>
                    <div className="bg-green-500 p-3 rounded-full">
                      <DollarSign className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Orders</p>
                      <p className="text-2xl font-bold text-gray-900">{salesData.totalOrders}</p>
                    </div>
                    <div className="bg-blue-500 p-3 rounded-full">
                      <BarChart3 className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                      <p className="text-2xl font-bold text-gray-900">${salesData.averageOrderValue}</p>
                    </div>
                    <div className="bg-purple-500 p-3 rounded-full">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Growth Rate</p>
                      <p className="text-2xl font-bold text-green-600">+{salesData.growthRate}%</p>
                    </div>
                    <div className="bg-emerald-500 p-3 rounded-full">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Products</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Product</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Sales</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salesData.topProducts.map((product, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-3 px-4 text-gray-900">{product.name}</td>
                          <td className="py-3 px-4 text-gray-600">{product.sales} units</td>
                          <td className="py-3 px-4 text-gray-900 font-medium">${product.revenue.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {selectedReport === 'inventory' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Items</p>
                      <p className="text-2xl font-bold text-gray-900">{inventoryData.totalItems}</p>
                    </div>
                    <div className="bg-blue-500 p-3 rounded-full">
                      <Package className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Value</p>
                      <p className="text-2xl font-bold text-gray-900">${inventoryData.totalValue.toLocaleString()}</p>
                    </div>
                    <div className="bg-green-500 p-3 rounded-full">
                      <DollarSign className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Low Stock</p>
                      <p className="text-2xl font-bold text-orange-600">{inventoryData.lowStockItems}</p>
                    </div>
                    <div className="bg-orange-500 p-3 rounded-full">
                      <AlertTriangle className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                      <p className="text-2xl font-bold text-red-600">{inventoryData.outOfStock}</p>
                    </div>
                    <div className="bg-red-500 p-3 rounded-full">
                      <AlertTriangle className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory by Category</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Category</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Items</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventoryData.categories.map((category, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-3 px-4 text-gray-900">{category.name}</td>
                          <td className="py-3 px-4 text-gray-600">{category.count} items</td>
                          <td className="py-3 px-4 text-gray-900 font-medium">${category.value.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {selectedReport === 'customers' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Report</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Name</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Email</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Location</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Total Orders</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customerData.map((customer, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-3 px-4 text-gray-900">{customer.name}</td>
                          <td className="py-3 px-4 text-gray-600">{customer.email}</td>
                          <td className="py-3 px-4 text-gray-600 capitalize">{customer.location}</td>
                          <td className="py-3 px-4 text-gray-900 font-medium">{customer.totalOrders}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {selectedReport === 'lowstock' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Low Stock Report</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Product</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Location</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Stock</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Minimum Stock</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lowStockData.map((item, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-3 px-4 text-gray-900">{item.product}</td>
                          <td className="py-3 px-4 text-gray-600 capitalize">{item.location}</td>
                          <td className="py-3 px-4 text-red-600 font-bold">{item.stock}</td>
                          <td className="py-3 px-4 text-gray-900">{item.minStock}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};