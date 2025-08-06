import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { LoginForm } from './components/auth/LoginForm';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './components/dashboard/Dashboard';
import { InventoryManagement } from './components/inventory/InventoryManagement';
import { CustomerManagement } from './components/customers/CustomerManagement';
import { InvoiceManagement } from './components/invoices/InvoiceManagement';
import { Reports } from './components/reports/Reports';
import { UserManagement } from './components/users/UserManagement';

const AppContent = () => {
  const { user, loading } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'inventory':
        return <InventoryManagement />;
      case 'customers':
        return <CustomerManagement />;
      case 'invoices':
        return <InvoiceManagement />;
      case 'reports':
        return <Reports />;
      case 'users':
        return <UserManagement />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <main className="flex-1 overflow-auto ml-20 md:ml-0">
        {renderContent()}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" reverseOrder={false} />
      <AppContent />
    </AuthProvider>
  );
}

export default App;