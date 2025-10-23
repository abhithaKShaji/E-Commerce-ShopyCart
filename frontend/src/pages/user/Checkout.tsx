import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddressForm, { type AddressData } from "../../features/checkout/components/AddressForm";
import AddressItem from "../../features/checkout/components/AddressItem";
import OrderSummary from "../../features/checkout/components/OrderSummary";
import { useCartContext } from "../../context/CartContext";
import { useCreateOrder } from "../../features/checkout/hooks/useCreateOrder";
import { useVerifyPayment } from "../../features/checkout/hooks/useVerifyPayment";
import { useClearCart } from "../../features/cart/hooks/useClearCart";
import { useAddresses } from "../../features/checkout/hooks/useAddress";
import { useAddAddress } from "../../features/checkout/hooks/useAddAddress";
import { useDeleteAddress } from "../../features/checkout/hooks/useDeleteAddress";

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cart } = useCartContext();

  const products =
  cart?.items
    .filter(item => item.product)
    .map(item => ({
      productId: item.product!._id,
      name: item.product!.name,
      brand: item.product!.brand,
      price: item.product!.price,
      images: item.product!.images,
      quantity: item.quantity,
    })) || [];

const total =
  cart?.items
    .filter(item => item.product)
    .reduce((sum, item) => sum + item.product!.price * item.quantity, 0) || 0;


  const { addresses, loading: loadingAddresses, fetchAddresses } = useAddresses();
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "Razorpay">("COD");

  const { addAddress } = useAddAddress();
  const { deleteAddress } = useDeleteAddress();
  const { createOrder, loading: creatingOrder } = useCreateOrder(); 
  const { verifyPayment, loading: verifyingPayment } = useVerifyPayment();
  const { clearCart, loading: clearingCart } = useClearCart();

  const token = localStorage.getItem("user_token");

  useEffect(() => {
    if (addresses.length && !selectedAddress)
      setSelectedAddress(addresses[0]._id);
  }, [addresses, selectedAddress]);

  const handleAddAddress = async (data: AddressData) => {
    try {
      const newAddress = await addAddress(data);
      await fetchAddresses();
      setSelectedAddress(newAddress._id);
      setShowForm(false);
      alert("Address added successfully!");
    } catch {
      alert("Failed to add address. Please try again.");
    }
  };

  const handleRemoveAddress = async (id: string) => {
    if (!token) return alert("You are not logged in");
    try {
      await deleteAddress(id, token);
      await fetchAddresses();
      if (selectedAddress === id) setSelectedAddress(addresses[0]?._id || null);
      alert("Address deleted successfully!");
    } catch {
      alert("Failed to delete address. Please try again.");
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) return alert("Please select an address");

    try {
      const order = await createOrder(total, selectedAddress, paymentMethod, products);

      if (paymentMethod === "Razorpay" && order.key) {
        await new Promise<void>((resolve, reject) => {
          if ((window as any).Razorpay) return resolve();
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
          document.body.appendChild(script);
        });

        const rzp = new (window as any).Razorpay({
          key: order.key,
          amount: order.amount,
          currency: order.currency,
          name: "ShopyCart",
          description: "Order Payment",
          order_id: order.orderId,
          handler: async (response: any) => {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            try {
              await clearCart();
            } catch {}
            alert("Payment successful");
            navigate("/success");
          },
          prefill: { name: "", email: "", contact: "" },
          theme: { color: "#3399cc" },
        });

        rzp.open();
      } else {
        try {
          await clearCart();
        } catch {}
        alert("Order placed successfully!");
        navigate("/success");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to place order");
    }
  };

  return (
    <section className="checkout mt-12 mb-32 container mx-auto px-4">
      <div className="flex flex-col lg:flex-row gap-8">

        <div className="flex-1">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => setShowForm(!showForm)}
          >
            + ADD ADDRESS
          </button>

          {showForm && <AddressForm onSubmit={handleAddAddress} loading={false} />}

          <div className="mt-4 space-y-4">
            {loadingAddresses ? (
              <p>Loading addresses...</p>
            ) : (
              addresses.map(a => (
                <AddressItem
                  key={a._id}
                  address={{ ...a, id: a._id }}
                  selected={selectedAddress === a._id}
                  onSelect={setSelectedAddress}
                  onRemove={() => handleRemoveAddress(a._id)}
                />
              ))
            )}
          </div>
        </div>

        <div className="w-full lg:w-1/3">
          <OrderSummary products={products} total={total} />
          <div className="mt-4">
            <p className="font-semibold mb-2">Select Payment Method:</p>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 font-medium">
                <input
                  type="radio"
                  name="payment-method"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                />
                Cash on Delivery
              </label>
              <label className="flex items-center gap-2 font-medium">
                <input
                  type="radio"
                  name="payment-method"
                  value="Razorpay"
                  checked={paymentMethod === "Razorpay"}
                  onChange={() => setPaymentMethod("Razorpay")}
                />
                Razorpay
              </label>
            </div>
          </div>
          <button
            className="mt-6 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
            onClick={handlePlaceOrder}
            disabled={creatingOrder || verifyingPayment || clearingCart}
          >
            {creatingOrder || verifyingPayment || clearingCart
              ? "Processing..."
              : "PLACE ORDER"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Checkout;
