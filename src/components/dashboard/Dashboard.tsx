import React from 'react';
import { DashboardStats } from './DashboardStats';
import { RecentActivity } from './RecentActivity';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { useDashboard } from '../../hooks/useApi';
import { useAuth } from '../../hooks/useAuth';

export const Dashboard = () => {
  const { user } = useAuth();
  const { data: stats, loading, error, refetch } = useDashboard();

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

  if (!stats) {
    return (
      <div className="p-6">
        <ErrorMessage message="No dashboard data available" onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.fullName}</h1>
        <p className="text-gray-600 mt-1">
          Here's what's happening with your {user?.location === 'all' ? 'business' : `${user?.location} location`} today.
        </p>
      </div>

      <DashboardStats stats={stats} userRole={user?.role || ''} />
      <RecentActivity activities={stats.recentActivities} />
    </div>
  );
};