import React from "react";
import { useNavigate } from "react-router-dom";
import { useProductsByCategory } from "../../products/hooks/useProductsByCategory";

const SidePromoBanner: React.FC = () => {
  const navigate = useNavigate();
  const { products, loading, error } = useProductsByCategory("fashion");

  const handleNavigate = () => {
    navigate("/products-page?category=fashion");
  };

  const mainProduct = products?.[0]; 

  return (
    <div
      className="bg-[#f8f5f1] rounded-lg flex flex-col justify-between items-center text-center p-6 h-full shadow-sm cursor-pointer hover:shadow-md transition"
      onClick={handleNavigate}
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Shop Your Fashion Needs
      </h2>
      <p className="text-gray-600 mb-4 text-sm">
        Discover the latest & trendy choices
      </p>

      {loading ? (
        <p className="text-gray-500 text-sm my-4">Loading trending item...</p>
      ) : error ? (
        <p className="text-red-500 text-sm my-4">{error}</p>
      ) : mainProduct ? (
        <img
          src={mainProduct.images?.[0]}
          alt={mainProduct.name}
          className="w-3/4 h-60 object-contain mb-4 rounded-lg transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
      ) : (
        <p className="text-gray-500 text-sm my-4">No products found.</p>
      )}

      <button
        onClick={handleNavigate}
        className="bg-gray-800 text-white px-5 py-2 rounded-md text-sm hover:bg-gray-700 transition"
      >
        Shop Now →
      </button>
    </div>
  );
};

export default SidePromoBanner;
