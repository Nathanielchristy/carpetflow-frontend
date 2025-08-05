import { useState, useEffect } from 'react';
import { ApiService } from '../services/api';
import { useAuth } from './useAuth';
import { 
  Customer, 
  CarpetItem, 
  Invoice, 
  StockMovement, 
  DashboardStats,
  SalesReport,
  InventoryReport,
  CustomerReport,
  PaginationParams,
  PaginatedResponse,
  ApiResponse,
  User
} from '../types';

// Generic hook for API calls
export const useApiCall = <T>(
  apiCall: () => Promise<ApiResponse<T>>,
  dependencies: any[] = []
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiCall();
      if (response.success) {
        setData(response.data || null);
      } else {
        setError(response.error || 'An error occurred');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  return { data, loading, error, refetch: fetchData };
};

// Dashboard hook
export const useDashboard = () => {
  const { user } = useAuth();
  
  return useApiCall<DashboardStats>(
    () => ApiService.getDashboardStats(user?.location || 'all'),
    [user?.location]
  );
};

// Customers hooks
export const useCustomers = (params?: PaginationParams) => {
  const { user } = useAuth();
  
  return useApiCall<PaginatedResponse<Customer>>(
    () => ApiService.getCustomers(user?.location || 'all', params),
    [user?.location, params?.page, params?.limit, params?.search, params?.sortBy, params?.sortOrder]
  );
};

export const useCustomer = (id: string) => {
  return useApiCall<Customer>(
    () => ApiService.getCustomer(id),
    [id]
  );
};

export const useCreateCustomer = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCustomer = async (customerData: Partial<Customer>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await ApiService.createCustomer(customerData);
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to create customer');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createCustomer, loading, error };
};

export const useUpdateCustomer = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCustomer = async (id: string, customerData: Partial<Customer>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await ApiService.updateCustomer(id, customerData);
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to update customer');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateCustomer, loading, error };
};

export const useDeleteCustomer = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteCustomer = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await ApiService.deleteCustomer(id);
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to delete customer');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteCustomer, loading, error };
};

// Inventory hooks
export const useInventory = (params?: PaginationParams) => {
  const { user } = useAuth();
  // Provide default params if not supplied
  const safeParams = params ?? { page: 1, limit: 10 };
  return useApiCall<PaginatedResponse<CarpetItem>>(
    () => ApiService.getInventory(user?.location || 'all', safeParams),
    [user?.location, safeParams.page, safeParams.limit, safeParams.search, safeParams.sortBy, safeParams.sortOrder]
  );
};

export const useCarpetItem = (id: string) => {
  return useApiCall<CarpetItem>(
    () => ApiService.getCarpetItem(id),
    [id]
  );
};

export const useCreateCarpetItem = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCarpetItem = async (itemData: Partial<CarpetItem>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await ApiService.createCarpetItem(itemData);
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to create item');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createCarpetItem, loading, error };
};

export const useUpdateCarpetItem = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCarpetItem = async (id: string, itemData: Partial<CarpetItem>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await ApiService.updateCarpetItem(id, itemData);
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to update item');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateCarpetItem, loading, error };
};

export const useUpdateStock = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const updateStock = async (
    id: string, 
    quantity: number, 
    movementType: 'in' | 'out' | 'adjustment',
    notes?: string
  ) => {
    try {
      setLoading(true);
      setError(null);
      const response = await ApiService.updateStock(id, quantity, movementType, user?.id || '', notes);
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to update stock');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateStock, loading, error };
};

// Invoice hooks
export const useInvoices = (params?: PaginationParams) => {
  const { user } = useAuth();
  
  return useApiCall<PaginatedResponse<Invoice>>(
    () => ApiService.getInvoices(user?.location || 'all', params),
    [user?.location, params?.page, params?.limit, params?.search, params?.sortBy, params?.sortOrder]
  );
};

export const useInvoice = (id: string) => {
  return useApiCall<Invoice>(
    () => ApiService.getInvoice(id),
    [id]
  );
};

export const useCreateInvoice = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createInvoice = async (invoiceData: Partial<Invoice>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await ApiService.createInvoice(invoiceData);
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to create invoice');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createInvoice, loading, error };
};

export const useUpdateInvoice = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateInvoice = async (id: string, invoiceData: Partial<Invoice>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await ApiService.updateInvoice(id, invoiceData);
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to update invoice');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateInvoice, loading, error };
};

export const useDeleteInvoice = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteInvoice = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await ApiService.deleteInvoice(id);
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to delete invoice');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteInvoice, loading, error };
};

// Stock movements hook
export const useStockMovements = (params?: PaginationParams) => {
  const { user } = useAuth();
  
  return useApiCall<PaginatedResponse<StockMovement>>(
    () => ApiService.getStockMovements(user?.location || 'all', params),
    [user?.location, params?.page, params?.limit, params?.search, params?.sortBy, params?.sortOrder]
  );
};

// Reports hooks
export const useSalesReport = (period: string) => {
  const { user } = useAuth();
  
  return useApiCall<SalesReport>(
    () => ApiService.getSalesReport(user?.location || 'all', period),
    [user?.location, period]
  );
};

export const useInventoryReport = () => {
  const { user } = useAuth();
  
  return useApiCall<InventoryReport>(
    () => ApiService.getInventoryReport(user?.location || 'all'),
    [user?.location]
  );
};

export const useCustomerReport = () => {
  const { user } = useAuth();
  
  return useApiCall<CustomerReport>(
    () => ApiService.getCustomerReport(user?.location || 'all'),
    [user?.location]
  );
};

// Users hooks
export const useUsers = (params?: PaginationParams) => {
  const { user } = useAuth();
  
  return useApiCall<PaginatedResponse<User>>(
    () => ApiService.getUsers(user?.location || 'all', params),
    [user?.location, params?.page, params?.limit, params?.search, params?.sortBy, params?.sortOrder]
  );
};

export const useUser = (id: string) => {
  return useApiCall<User>(
    () => ApiService.getUser(id),
    [id]
  );
};

export const useCreateUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createUser = async (userData: Partial<User>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await ApiService.createUser(userData);
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to create user');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createUser, loading, error };
};

export const useUpdateUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateUser = async (id: string, userData: Partial<User>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await ApiService.updateUser(id, userData);
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to update user');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateUser, loading, error };
};

export const useDeleteUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteUser = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await ApiService.deleteUser(id);
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to delete user');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteUser, loading, error };
};