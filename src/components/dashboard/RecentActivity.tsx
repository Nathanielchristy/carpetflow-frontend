import React from 'react';
import { Activity, DollarSign, Package, AlertTriangle, CheckCircle } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'sale' | 'inventory' | 'payment' | 'alert';
  description: string;
  amount?: number;
  time: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

export const RecentActivity = ({ activities }: RecentActivityProps) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'sale':
        return <DollarSign className="h-4 w-4 text-green-600" />;
      case 'inventory':
        return <Package className="h-4 w-4 text-blue-600" />;
      case 'payment':
        return <CheckCircle className="h-4 w-4 text-emerald-600" />;
      case 'alert':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex-shrink-0 mt-1">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{activity.description}</p>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-gray-500">{activity.time}</p>
                  {activity.amount && (
                    <span className="text-sm font-medium text-green-600">
                      +${activity.amount.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};