import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faStarHalfAlt,
  faHeart as faSolidHeart,
} from "@fortawesome/free-solid-svg-icons";
import ProductSkeleton from "./ProductSkeleton";

interface Product {
  _id: string;
  name: string;
  brand?: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, loading, error }) => {
  const navigate = useNavigate();

  const handleProductClick = (id: string) => {
    navigate(`/view-product/${id}`);
  };

  if (loading) return <ProductSkeleton count={8} />;

  if (error)
    return (
      <div className="flex-1 text-center py-10 text-red-500">
        Error: {error}
      </div>
    );

  if (products.length === 0)
    return (
      <div className="flex-1 text-center py-20 text-gray-500">
        No products found.
      </div>
    );

  return (
    <section className="flex-1 mb-20">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">All Products</h2>
        <p className="text-sm text-gray-500 mt-2">
          Showing {products.length} products
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <div
            key={p._id}
            className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 relative group cursor-pointer"
            onClick={() => handleProductClick(p._id)}
          >
            <div className="w-full h-56 bg-gray-50 flex items-center justify-center">
              <img
                src={p.images?.[0] || "/placeholder.jpg"}
                alt={p.name}
                className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="p-4">
              <span className="block text-sm text-gray-500">
                {p.brand || "No Brand"}
              </span>

              <h3 className="text-base font-semibold mt-1 truncate text-gray-800">
                {p.name}
              </h3>

              <div className="flex items-center space-x-1 text-yellow-400 mt-2">
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStarHalfAlt} />
              </div>

              <div className="mt-3">
                <h4 className="font-bold text-gray-800">₹{p.price}</h4>
              </div>
            </div>

            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors duration-200"
              aria-label="Add to wishlist"
              onClick={(e) => e.stopPropagation()} 
            >
              <FontAwesomeIcon
                icon={faSolidHeart}
                className="w-5 h-5 transition-transform duration-200 group-hover:scale-110"
              />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;
