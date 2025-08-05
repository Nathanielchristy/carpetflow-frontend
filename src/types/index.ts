export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'salesperson' | 'warehouse' | 'accountant';
  location: string;
  createdAt: string;
  updatedAt?: string;
  isActive: boolean;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  location: string;
  taxNumber?: string;
  creditLimit?: number;
  paymentTerms?: string;
  createdAt: string;
  updatedAt?: string;
  createdBy: string;
}

export interface CarpetItem {
  id: string;
  name: string;
  type: string;
  color: string;
  size: string;
  material: string;
  rollLength: number;
  unitPrice: number;
  costPrice: number;
  stockQuantity: number;
  minimumStock: number;
  maximumStock: number;
  barcode: string;
  sku: string;
  location: string;
  supplier?: string;
  description?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt?: string;
  createdBy: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customer: Customer;
  items: InvoiceItem[];
  subtotal: number;
  discountPercentage: number;
  discountAmount: number;
  taxPercentage: number;
  taxAmount: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'unpaid' | 'partially_paid' | 'cancelled';
  paymentAmount: number;
  paymentMethod?: string;
  paymentDate?: string;
  dueDate: string;
  notes?: string;
  location: string;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  carpetId: string;
  carpet: CarpetItem;
  quantity: number;
  unitPrice: number;
  discountPercentage: number;
  discountAmount: number;
  total: number;
}

export interface StockMovement {
  id: string;
  carpetId: string;
  carpet: CarpetItem;
  movementType: 'in' | 'out' | 'adjustment' | 'transfer';
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  referenceType?: 'invoice' | 'purchase' | 'adjustment' | 'transfer';
  referenceId?: string;
  notes?: string;
  location: string;
  createdBy: string;
  createdAt: string;
}

export interface DashboardStats {
  totalSales: number;
  totalCustomers: number;
  totalInventory: number;
  lowStockItems: number;
  monthlyRevenue: number;
  pendingInvoices: number;
  totalInvoices: number;
  paidInvoices: number;
  unpaidInvoices: number;
  inventoryValue: number;
  topSellingProducts: Array<{
    id: string;
    name: string;
    quantitySold: number;
    revenue: number;
  }>;
  recentActivities: Array<{
    id: string;
    type: string;
    description: string;
    amount?: number;
    time: string;
  }>;
}

export interface SalesReport {
  period: string;
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  growthRate: number;
  salesByLocation: Array<{
    location: string;
    revenue: number;
    orders: number;
  }>;
  salesByProduct: Array<{
    productId: string;
    productName: string;
    quantitySold: number;
    revenue: number;
  }>;
  salesByCustomer: Array<{
    customerId: string;
    customerName: string;
    totalOrders: number;
    totalRevenue: number;
  }>;
}

export interface InventoryReport {
  totalItems: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  overStockItems: number;
  inventoryByCategory: Array<{
    category: string;
    count: number;
    value: number;
  }>;
  inventoryByLocation: Array<{
    location: string;
    count: number;
    value: number;
  }>;
  stockMovements: StockMovement[];
}

export interface CustomerReport {
  totalCustomers: number;
  newCustomersThisMonth: number;
  topCustomers: Array<{
    customerId: string;
    customerName: string;
    totalOrders: number;
    totalRevenue: number;
    lastOrderDate: string;
  }>;
  customersByLocation: Array<{
    location: string;
    count: number;
  }>;
}

export interface FormData {
  [key: string]: any;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, any>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}