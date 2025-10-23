import React, { useState } from "react";
import type { Product } from "../hooks/useSingleProduct";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faBoltLightning, faHeart } from "@fortawesome/free-solid-svg-icons";
import { useAddToCart } from "../../cart/hooks/useAddToCart";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../../../context/UserAuthContext"; 

interface ProductDetailsProps {
  product: Product;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState<string | number | null>(null);
  const { addToCart, loading, error } = useAddToCart();
  const { user } = useUserAuth(); 
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please login to add products to cart", { position: "top-right" });
      navigate("/login");
      return;
    }

    try {
      await addToCart(product._id, 1);
      toast.success("Product added to cart!", { position: "top-right" });
    } catch (err: any) {
      toast.error(error || "Failed to add to cart", { position: "top-right" });
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      toast.error("Please login to continue", { position: "top-right" });
      navigate("/login");
      return;
    }

    navigate("/checkout");
  };

  const showSize = product.category === "fashion";
  const sizeOptions: Array<string | number> = ["S", "M", "L", "XL", "XXL"];

  return (
    <div className="w-full md:w-1/2 mt-8 md:mt-0 md:pl-10">
      <Toaster />

      <h6 className="text-gray-500 text-sm">{product.brand}</h6>
      <h4 className="text-2xl font-semibold mt-1">{product.name}</h4>
      <h2 className="text-3xl font-bold text-gray-800 mt-3">₹{product.price}</h2>

      {showSize && (
        <div className="mt-4">
          <label htmlFor="size" className="block text-gray-600 mb-1 text-sm">
            Size
          </label>
          <select
            id="size"
            value={selectedSize || ""}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <option value="">Select size</option>
            {sizeOptions.map((size, idx) => (
              <option key={idx} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      )}

      
      <div className="mt-6">
        <h4 className="text-lg font-semibold mb-1">Product Description</h4>
        <p className="text-gray-600 text-sm leading-relaxed">
          {product.description}
        </p>
      </div>

  
      <div className="mt-8 flex flex-wrap gap-3">
        <button
          onClick={handleAddToCart}
          disabled={loading}
          className="bg-gray-900 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition disabled:opacity-50"
        >
          <FontAwesomeIcon icon={faCartShopping} />{" "}
          {loading ? "Adding..." : "ADD TO CART"}
        </button>

        <button
          onClick={handleBuyNow}
          className="bg-yellow-500 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-yellow-400 transition"
        >
          <FontAwesomeIcon icon={faBoltLightning} /> BUY NOW
        </button>
      </div>

      
      <button className="mt-6 text-sm font-medium text-gray-600 hover:text-red-500 flex items-center gap-2">
        <FontAwesomeIcon icon={faHeart} /> ADD TO WISHLIST
      </button>
    </div>
  );
};

export default ProductDetails;
