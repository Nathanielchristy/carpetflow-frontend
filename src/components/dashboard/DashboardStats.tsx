import React from 'react';
import { Package, Users, DollarSign, AlertTriangle, TrendingUp, FileText } from 'lucide-react';
import { DashboardStats as StatsType } from '../../types';

interface DashboardStatsProps {
  stats: StatsType;
  userRole: string;
}

export const DashboardStats = ({ stats, userRole }: DashboardStatsProps) => {
  const getStatsCards = () => {
    const baseCards = [
      {
        title: 'Total Sales',
        value: `$${stats.totalSales.toLocaleString()}`,
        icon: DollarSign,
        color: 'bg-green-500',
        show: ['admin', 'salesperson', 'accountant']
      },
      {
        title: 'Total Customers',
        value: stats.totalCustomers.toString(),
        icon: Users,
        color: 'bg-blue-500',
        show: ['admin', 'salesperson', 'accountant']
      },
      {
        title: 'Inventory Items',
        value: stats.totalInventory.toString(),
        icon: Package,
        color: 'bg-purple-500',
        show: ['admin', 'warehouse', 'salesperson']
      },
      {
        title: 'Low Stock Alerts',
        value: stats.lowStockItems.toString(),
        icon: AlertTriangle,
        color: 'bg-red-500',
        show: ['admin', 'warehouse']
      },
      {
        title: 'Monthly Revenue',
        value: `$${stats.monthlyRevenue.toLocaleString()}`,
        icon: TrendingUp,
        color: 'bg-emerald-500',
        show: ['admin', 'accountant']
      },
      {
        title: 'Pending Invoices',
        value: stats.pendingInvoices.toString(),
        icon: FileText,
        color: 'bg-orange-500',
        show: ['admin', 'salesperson', 'accountant']
      }
    ];

    return baseCards.filter(card => card.show.includes(userRole));
  };

  const visibleCards = getStatsCards();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {visibleCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{card.value}</p>
              </div>
              <div className={`${card.color} p-3 rounded-full`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};