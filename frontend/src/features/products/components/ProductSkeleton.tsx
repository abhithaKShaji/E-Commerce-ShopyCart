// src/features/products/components/ProductSkeleton.tsx
import React from "react";

interface ProductSkeletonProps {
  count?: number;
}

const ProductSkeleton: React.FC<ProductSkeletonProps> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse"
        >
          <div className="w-full h-56 bg-gray-200 flex items-center justify-center"></div>
          <div className="p-4 space-y-2">
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mt-2"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductSkeleton;
