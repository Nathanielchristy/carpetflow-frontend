import React from 'react';
import { 
  Home, 
  Package, 
  Users, 
  FileText, 
  BarChart3, 
  Settings, 
  LogOut,
  Warehouse,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const Sidebar = ({ activeSection, onSectionChange }: SidebarProps) => {
  const { user, logout } = useAuth();

  const getMenuItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
    ];

    const roleSpecificItems: Record<string, any[]> = {
      admin: [
        { id: 'inventory', label: 'Inventory', icon: Package },
        { id: 'customers', label: 'Customers', icon: Users },
        { id: 'invoices', label: 'Invoices', icon: FileText },
        { id: 'reports', label: 'Reports', icon: BarChart3 },
        { id: 'users', label: 'User Management', icon: Settings },
      ],
      salesperson: [
        { id: 'customers', label: 'Customers', icon: Users },
        { id: 'invoices', label: 'Invoices', icon: FileText },
        { id: 'inventory', label: 'View Inventory', icon: Package },
      ],
      warehouse: [
        { id: 'inventory', label: 'Inventory', icon: Warehouse },
        { id: 'reports', label: 'Stock Reports', icon: BarChart3 },
      ],
      accountant: [
        { id: 'invoices', label: 'Invoices', icon: FileText },
        { id: 'reports', label: 'Financial Reports', icon: DollarSign },
        { id: 'customers', label: 'Customers', icon: Users },
      ],
    };

    return [...baseItems, ...(roleSpecificItems[user?.role || ''] || [])];
  };

  const menuItems = getMenuItems();

  return (
    <aside className="bg-white shadow-lg h-screen w-64 flex flex-col fixed md:static top-0 left-0 z-40 md:z-auto transition-transform md:translate-x-0 md:relative md:w-64 min-h-0 overflow-y-auto">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">Carpet Flow</h1>
        <p className="text-sm text-gray-500 mt-1">{user?.location === 'all' ? 'All Locations' : user?.location}</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    activeSection === item.id
                      ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200 mt-auto">
        <div className="mb-4">
          <div className="text-sm font-medium text-gray-900">{user?.fullName}</div>
          <div className="text-xs text-gray-500 capitalize">{user?.role}</div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
        >
          <LogOut className="h-4 w-4 mr-3" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};