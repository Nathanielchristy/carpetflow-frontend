import toast from 'react-hot-toast';
import { 
  User, 
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
  ApiResponse
} from '../types';

const API_BASE_URL = 'https://carpetflow-backend.onrender.com/api';

// Utility function to get auth token
const getAuthToken = (): string | null => {
  const user = localStorage.getItem('carpet-flow-user');
  if (user) {
    const userData = JSON.parse(user);
    return userData.token || null;
  }
  return null;
};

// Utility function to make API requests
const apiRequest = async <T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    const token = getAuthToken();
            const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          ...(options.headers as Record<string, string>),
        };

        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      // Handle non-JSON responses (like rate limit HTML pages)
      const text = await response.text();
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Request failed: ${response.status}`);
    }

    return data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    toast.error(errorMessage);
    console.error('API request error:', error);
    throw error;
  }
};

// API Service Class
export class ApiService {
  // Authentication
  static async login(email: string, password: string): Promise<ApiResponse<User>> {
    const response = await apiRequest<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.data) {
      // Store user with token
      localStorage.setItem('carpet-flow-user', JSON.stringify({
        ...response.data.user,
        token: response.data.token
      }));
      return { success: true, data: response.data.user };
    }
    
    return { success: false, error: 'Login failed' };
  }

  // Users
  static async getUsers(
    userLocation: string,
    params?: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<User>>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }

    const response = await apiRequest<PaginatedResponse<User>>(`/users?${queryParams}`);
    return response;
  }

  static async getUser(id: string): Promise<ApiResponse<User>> {
    const response = await apiRequest<User>(`/users/${id}`);
    return response;
  }

  static async createUser(userData: Partial<User>): Promise<ApiResponse<User>> {
    const response = await apiRequest<User>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    return response;
  }

  static async updateUser(id: string, userData: Partial<User>): Promise<ApiResponse<User>> {
    const response = await apiRequest<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
    
    return response;
  }

  static async deleteUser(id: string): Promise<ApiResponse<boolean>> {
    const response = await apiRequest<boolean>(`/users/${id}`, {
      method: 'DELETE',
    });
    
    return response;
  }

  // Customers
  static async getCustomers(
    userLocation: string, 
    params?: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<Customer>>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }

    const response = await apiRequest<PaginatedResponse<Customer>>(`/customers?${queryParams}`);
    return response;
  }

  static async getCustomer(id: string): Promise<ApiResponse<Customer>> {
    const response = await apiRequest<Customer>(`/customers/${id}`);
    return response;
  }

  static async createCustomer(customerData: Partial<Customer>): Promise<ApiResponse<Customer>> {
    const response = await apiRequest<Customer>('/customers', {
      method: 'POST',
      body: JSON.stringify(customerData),
    });
    
    return response;
  }

  static async updateCustomer(id: string, customerData: Partial<Customer>): Promise<ApiResponse<Customer>> {
    const response = await apiRequest<Customer>(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(customerData),
    });
    
    return response;
  }

  static async deleteCustomer(id: string): Promise<ApiResponse<boolean>> {
    const response = await apiRequest<boolean>(`/customers/${id}`, {
      method: 'DELETE',
    });
    
    return response;
  }

  // Inventory
  static async getInventory(
    userLocation: string, 
    params?: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<CarpetItem>>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }

    const response = await apiRequest<PaginatedResponse<CarpetItem>>(`/inventory?${queryParams}`);
    return response;
  }

  static async getCarpetItem(id: string): Promise<ApiResponse<CarpetItem>> {
    const response = await apiRequest<CarpetItem>(`/inventory/${id}`);
    return response;
  }

  static async createCarpetItem(itemData: Partial<CarpetItem>): Promise<ApiResponse<CarpetItem>> {
    const response = await apiRequest<CarpetItem>('/inventory', {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
    
    return response;
  }

  static async updateCarpetItem(id: string, itemData: Partial<CarpetItem>): Promise<ApiResponse<CarpetItem>> {
    const response = await apiRequest<CarpetItem>(`/inventory/${id}`, {
      method: 'PUT',
      body: JSON.stringify(itemData),
    });
    
    return response;
  }

  static async deleteCarpetItem(id: string): Promise<ApiResponse<boolean>> {
    const response = await apiRequest<boolean>(`/inventory/${id}`, {
      method: 'DELETE',
    });
    
    return response;
  }

  static async updateStock(
    id: string, 
    quantity: number, 
    movementType: 'in' | 'out' | 'adjustment',
    userId: string,
    notes?: string
  ): Promise<ApiResponse<CarpetItem>> {
    const response = await apiRequest<CarpetItem>(`/inventory/${id}/stock`, {
      method: 'PATCH',
      body: JSON.stringify({
        quantity,
      movementType: movementType,
        notes
      }),
    });
    
    return response;
  }

  // Invoices
  static async getInvoices(
    userLocation: string, 
    params?: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<Invoice>>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }

    const response = await apiRequest<PaginatedResponse<Invoice>>(`/invoices?${queryParams}`);
    return response;
  }

  static async getInvoice(id: string): Promise<ApiResponse<Invoice>> {
    const response = await apiRequest<Invoice>(`/invoices/${id}`);
    return response;
  }

  static async createInvoice(invoiceData: Partial<Invoice>): Promise<ApiResponse<Invoice>> {
    const response = await apiRequest<Invoice>('/invoices', {
      method: 'POST',
      body: JSON.stringify(invoiceData),
    });
    
    return response;
  }

  static async updateInvoice(id: string, invoiceData: Partial<Invoice>): Promise<ApiResponse<Invoice>> {
    const response = await apiRequest<Invoice>(`/invoices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(invoiceData),
    });
    
    return response;
  }

  static async deleteInvoice(id: string): Promise<ApiResponse<boolean>> {
    const response = await apiRequest<boolean>(`/invoices/${id}`, {
      method: 'DELETE',
    });
    
    return response;
  }

  // Stock Movements
  static async getStockMovements(
    userLocation: string,
    params?: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<StockMovement>>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }

    const response = await apiRequest<PaginatedResponse<StockMovement>>(`/stock?${queryParams}`);
    return response;
  }

  // Dashboard & Reports
  static async getDashboardStats(userLocation: string): Promise<ApiResponse<DashboardStats>> {
    const response = await apiRequest<DashboardStats>('/dashboard/stats');
    return response;
  }

  static async getSalesReport(
    userLocation: string, 
    period: string
  ): Promise<ApiResponse<SalesReport>> {
    const response = await apiRequest<SalesReport>(`/reports/sales?period=${period}`);
    return response;
  }

  static async getInventoryReport(userLocation: string): Promise<ApiResponse<InventoryReport>> {
    const response = await apiRequest<InventoryReport>('/reports/inventory');
    return response;
  }

  static async getCustomerReport(userLocation: string): Promise<ApiResponse<CustomerReport>> {
    const response = await apiRequest<CustomerReport>('/reports/customers');
    return response;
  }
}