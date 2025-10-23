// src/features/products/components/ViewProductSkeleton.tsx
import React from "react";

const ViewProductSkeleton: React.FC = () => {
  return (
    <section className="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row gap-10 animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full md:w-1/2 flex flex-col items-center">
        <div className="w-full max-w-md h-96 bg-gray-200 rounded-lg mb-4"></div>
        <div className="flex gap-3 mt-4 flex-wrap justify-center">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="w-20 h-20 bg-gray-200 rounded-md"
            ></div>
          ))}
        </div>
      </div>

      {/* Details Skeleton */}
      <div className="w-full md:w-1/2 flex flex-col gap-4">
        <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
        <div className="h-6 w-3/4 bg-gray-200 rounded"></div>
        <div className="h-8 w-1/2 bg-gray-200 rounded"></div>

        <div className="mt-4">
          <div className="h-4 w-1/3 bg-gray-200 rounded mb-2"></div>
          <div className="h-8 w-1/2 bg-gray-200 rounded"></div>
        </div>

        <div className="mt-6 space-y-2">
          <div className="h-4 w-full bg-gray-200 rounded"></div>
          <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
          <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
          <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
        </div>

        <div className="mt-6 h-6 w-40 bg-gray-200 rounded"></div>
      </div>
    </section>
  );
};

export default ViewProductSkeleton;
