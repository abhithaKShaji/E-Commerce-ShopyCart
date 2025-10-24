import { useCartContext } from "../../context/CartContext";
import CartItemRow from "../../features/cart/components/CartItemRow";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const { cart } = useCartContext();
  const navigate = useNavigate();

  const totalValue =
    cart?.items?.reduce((sum, item) => {
      const price = item?.product?.price || 0;
      const quantity = item?.quantity || 0;
      return sum + price * quantity;
    }, 0) || 0;

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold">Your cart is empty.</h2>
        <button
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => navigate("/")}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <section className="p-4 md:p-6 lg:p-10">
      {/* Table for desktop/tablet */}
      <div className="hidden md:block overflow-x-auto shadow rounded-lg bg-white">
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left">Item</th>
              <th className="px-6 py-3 text-left">Quantity</th>
              <th className="px-6 py-3 text-left">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {cart.items.map((item) =>
              item?.product ? <CartItemRow key={item._id} item={item} /> : null
            )}
          </tbody>
        </table>
      </div>

      {/* Card view for mobile */}
      <div className="md:hidden space-y-4">
        {cart.items.map((item) =>
          item?.product ? <CartItemRow key={item._id} item={item} mobileView /> : null
        )}
      </div>

      {/* Total and Checkout */}
      <div className="flex flex-col md:flex-row justify-end mt-6 gap-4">
        <div className="w-full md:w-1/3 bg-white p-4 rounded shadow">
          <div className="flex justify-between text-lg font-semibold mb-4">
            <span>Total:</span>
            <span>₹ {totalValue}</span>
          </div>
          <button
            className="w-full px-4 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700"
            onClick={() => navigate("/checkout")}
          >
            PLACE ORDER
          </button>
        </div>
      </div>
    </section>
  );
};

export default CartPage;
