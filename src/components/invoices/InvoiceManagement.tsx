import React, { useState } from 'react';
import { Plus, Search, Filter, FileText, Download, Eye, DollarSign, Trash2, Edit, PrinterIcon } from 'lucide-react';
import { Invoice } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { useInvoices, useCreateInvoice, useUpdateInvoice, useDeleteInvoice } from '../../hooks/useApi';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { Modal } from '../common/Modal';
import { Pagination } from '../common/Pagination';
import { pdf } from '@react-pdf/renderer';
import InvoicePDF from './InvoicePDF';
import { InvoiceForm } from './InvoiceForm';
import { useCustomers, useInventory } from '../../hooks/useApi';



export const InvoiceManagement = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const { data: invoicesData, loading, error, refetch } = useInvoices({
    page: currentPage,
    limit: 10,
    search: searchTerm,
    filters: statusFilter !== 'all' ? { status: statusFilter } : undefined
  });

  const { createInvoice, loading: createLoading } = useCreateInvoice();
  const { updateInvoice, loading: updateLoading } = useUpdateInvoice();
  const { deleteInvoice, loading: deleteLoading } = useDeleteInvoice();

  const { data: customersData } = useCustomers({});
  const { data: inventoryData } = useInventory({});


  const handlePrintInvoice = async (invoice: Invoice) => {
    const printWindow = window.open('about:blank'); // open synchronously

    if (!printWindow) {
      alert('Please allow popups for this website to print the invoice.');
      return;
    }

    try {
      const doc = <InvoicePDF invoice={invoice} />;
      const asPdf = pdf();
      asPdf.updateContainer(doc);
      const blob = await asPdf.toBlob();
      const blobUrl = URL.createObjectURL(blob);

      printWindow.location.href = blobUrl;

      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();

        setTimeout(() => {
          URL.revokeObjectURL(blobUrl);
          printWindow.close();
        }, 1000);
      };
    } catch (error) {
      console.error('Failed to print invoice:', error);
      printWindow.close();
    }
  };


  const handleDownloadInvoice = async (invoice: Invoice) => {
  try {
    const doc = <InvoicePDF invoice={invoice} />;
    const asPdf = pdf();
    asPdf.updateContainer(doc);
    const blob = await asPdf.toBlob();
    const blobUrl = URL.createObjectURL(blob);

    // Create a temporary link to trigger download
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `Invoice-${invoice.invoiceNumber || invoice.id}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
  } catch (error) {
    console.error('Failed to download invoice:', error);
  }
};


  const handleCreateInvoice = async (data: Partial<Invoice>) => {
    try {
      await createInvoice({
        ...data,
        location: user?.location === 'all' ? 'dubai' : user?.location,
        createdBy: user?.id
      });
      setShowCreateForm(false);
      refetch();
    } catch (error) {
      console.error('Error creating invoice:', error);
    }
  };

  const handleUpdateInvoice = async (data: Partial<Invoice>) => {
    if (!selectedInvoice) return;
    
    try {
      await updateInvoice(selectedInvoice.id, data);
      setShowEditForm(false);
      setSelectedInvoice(null);
      refetch();
    } catch (error) {
      console.error('Error updating invoice:', error);
    }
  };

  const handleDeleteInvoice = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await deleteInvoice(id);
        refetch();
      } catch (error) {
        console.error('Error deleting invoice:', error);
      }
    }
  };

  const openEditForm = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowEditForm(true);
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

  const invoices = invoicesData?.data || [];
  const canEdit = user?.role === 'admin' || user?.role === 'salesperson' || user?.role === 'accountant';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'unpaid':
        return 'bg-red-100 text-red-800';
      case 'partially_paid':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Paid';
      case 'unpaid':
        return 'Unpaid';
      case 'partially_paid':
        return 'Partially Paid';
      default:
        return status;
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Invoice Management</h1>
          <p className="text-gray-600 mt-1">
            Manage invoices, payments, and customer billing
          </p>
        </div>
        {canEdit && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Create Invoice</span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
                <option value="partially_paid">Partially Paid</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="font-medium text-gray-900">{invoice.invoiceNumber}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{invoice.customer?.name}</div>
                      <div className="text-sm text-gray-500">{invoice.customer?.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                      <span className="font-medium text-gray-900">
                        {invoice.total.toLocaleString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                      {getStatusText(invoice.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(invoice.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900" title="View Invoice">
                        <Eye className="h-4 w-4" />
                      </button>
                      {canEdit && (
                        <>
                          <button
                            onClick={() => openEditForm(invoice)}
                            className="text-green-600 hover:text-green-900"
                            title="Edit Invoice"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteInvoice(invoice.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete Invoice"
                            disabled={deleteLoading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    <div className="flex space-x-2">
                      <button
                        className="text-gray-600 hover:text-gray-900"
                        title="Download"
                        onClick={() => handleDownloadInvoice(invoice)}
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        className="text-gray-600 hover:text-gray-900"
                        title="Print Invoice"
                        onClick={() => handlePrintInvoice(invoice)}
                      >
                        <PrinterIcon className="h-4 w-4" />
                      </button>
                    </div>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {invoicesData && invoicesData.totalPages > 1 && (
          <div className="p-6 border-t border-gray-200">
            <Pagination
              currentPage={currentPage}
              totalPages={invoicesData.totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* Create Invoice Modal */}
      <Modal
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        title="Create New Invoice"
        size="lg"
      >
        <InvoiceForm
          customers={customersData?.data || []}
          inventory={inventoryData?.data || []}
          onSubmit={handleCreateInvoice}
          onCancel={() => setShowCreateForm(false)}
          loading={createLoading}
        />
      </Modal>

      {/* Edit Invoice Modal */}
      <Modal
        isOpen={showEditForm}
        onClose={() => setShowEditForm(false)}
        title="Edit Invoice"
        size="lg"
      >
        <InvoiceForm
          invoice={selectedInvoice}
          customers={customersData?.data || []}
          inventory={inventoryData?.data || []}
          onSubmit={handleUpdateInvoice}
          onCancel={() => {
            setShowEditForm(false);
            setSelectedInvoice(null);
          }}
          loading={updateLoading}
        />
      </Modal>
    </div>
  );
};