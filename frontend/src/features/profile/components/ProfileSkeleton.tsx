// src/features/profile/components/ProfileSkeleton.tsx
import React from "react";

const ProfileSkeleton: React.FC = () => {
  return (
    <section className="container mx-auto p-4 md:p-10 flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
      {/* Sidebar Skeleton */}
      <div className="bg-gray-200 animate-pulse w-full md:w-1/4 h-64 rounded-lg"></div>

      {/* Profile + Address Skeleton */}
      <div className="flex-1 flex flex-col space-y-6">
        {/* Profile Details Skeleton */}
        <div className="bg-white p-6 rounded-lg shadow w-full md:w-2/4 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>

        {/* Addresses Skeleton */}
        <div className="bg-white p-6 rounded-lg shadow w-full animate-pulse space-y-4">
          {Array.from({ length: 2 }).map((_, idx) => (
            <div key={idx} className="h-16 bg-gray-200 rounded w-full"></div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProfileSkeleton;
