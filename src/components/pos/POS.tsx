import React, { useState, useMemo } from 'react';
import { useInventory, useCreateInvoice, useCreateCustomer } from '../../hooks/useApi';
import { useAuth } from '../../hooks/useAuth';
import ProductCard from './ProductCard';
import CartItem, { CartItemType } from './CartItem';
import PaymentModal, { PaymentDetails } from './PaymentModal';
import { CarpetItem, InvoiceItem } from '../../types';
import toast from 'react-hot-toast';

const POS = () => {
  const { data: inventoryData, loading, error } = useInventory({ page: 1, limit: 50 });
  const [cart, setCart] = useState<CartItemType[]>([]);
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const { user } = useAuth();
  const { createInvoice, loading: invoiceLoading } = useCreateInvoice();
  const { createCustomer, loading: customerLoading } = useCreateCustomer();

  const handleAddToCart = (product: CarpetItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.product.unitPrice * item.quantity, 0);
  }, [cart]);

  const handleCheckout = async (paymentDetails: PaymentDetails) => {
    if (!user) {
      toast.error('You must be logged in to complete a transaction.');
      return;
    }

    const toastId = toast.loading('Processing transaction...');

    try {
      // Step 1: Create a customer
      const customerData = {
        name: paymentDetails.customerName,
        email: `${Date.now()}@walkin.com`, // Dummy unique email
        phone: '0000000000', // Dummy phone
        address: 'N/A',
        city: 'N/A',
        location: user.location,
      };

      const newCustomer = await createCustomer(customerData);
      if (!newCustomer || !newCustomer.id) {
        throw new Error('Failed to create customer for the transaction.');
      }

      // Step 2: Create the invoice
      const invoiceItems: Omit<InvoiceItem, 'id' | 'invoiceId' | 'carpet'>[] = cart.map(item => ({
        carpetId: item.product.id,
        quantity: item.quantity,
        unitPrice: item.product.unitPrice,
        discountPercentage: 0,
        discountAmount: 0,
        total: item.product.unitPrice * item.quantity,
      }));

      const invoiceData = {
        customerId: newCustomer.id,
        items: invoiceItems,
        subtotal: cartTotal,
        total: cartTotal,
        status: 'paid' as const,
        paymentMethod: paymentDetails.paymentMethod,
        location: user.location,
        createdBy: user.id,
        dueDate: new Date().toISOString(),
      };

      await createInvoice(invoiceData);

      toast.success('Transaction completed successfully!', { id: toastId });
      setPaymentModalOpen(false);
      setCart([]); // Clear cart
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      toast.error(`Transaction failed: ${errorMessage}`, { id: toastId });
    }
  };

  const isLoading = invoiceLoading || customerLoading;

  return (
    <>
      <div className="flex h-screen bg-gray-100">
        {/* Product Catalog */}
        <div className="w-2/3 p-4 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-4">Product Catalog</h1>
          {loading && <p>Loading products...</p>}
          {error && <p className="text-red-500">{error}</p>}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {inventoryData?.data.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
            ))}
          </div>
        </div>

        {/* Cart */}
        <div className="w-1/3 bg-white p-4 border-l flex flex-col">
          <h1 className="text-2xl font-bold mb-4">Cart</h1>
          <div className="flex-grow overflow-y-auto">
            {cart.length === 0 ? (
              <p className="text-gray-500">Cart is empty</p>
            ) : (
              cart.map((item) => (
                <CartItem
                  key={item.product.id}
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveFromCart={handleRemoveFromCart}
                />
              ))
            )}
          </div>
          <div className="mt-4 border-t pt-4">
            <p className="font-bold text-lg">Total: ${cartTotal.toFixed(2)}</p>
            <button
              className="w-full bg-blue-500 text-white py-2 rounded-lg mt-4 disabled:bg-gray-400"
              disabled={cart.length === 0 || isLoading}
              onClick={() => setPaymentModalOpen(true)}
            >
              {isLoading ? 'Processing...' : 'Proceed to Payment'}
            </button>
          </div>
        </div>
      </div>
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        cart={cart}
        total={cartTotal}
        onSubmit={handleCheckout}
      />
    </>
  );
};

export default POS;
