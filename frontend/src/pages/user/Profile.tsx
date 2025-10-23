import React, { useState } from "react";
import Sidebar from "../../features/profile/components/Sidebar";
import ProfileDetails from "../../features/profile/components/ProfileDetails";
import Addresses from "../../features/profile/components/Addresses";
import { useUserProfile } from "../../features/login/hooks/useUserProfile";
import ProfileSkeleton from "../../features/profile/components/ProfileSkeleton";
import type { Address } from "../../features/profile/types";

const ProfilePage: React.FC = () => {
  const { user, loading, error } = useUserProfile();
  const [addresses, setAddresses] = useState<Address[]>([]);

  const handleAddAddress = (address: Address) => setAddresses([...addresses, address]);
  const handleRemoveAddress = (id: string) => setAddresses(addresses.filter((a) => a.id !== id));

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  if (!user) {
    return <div className="text-center mt-10 text-gray-600">No user found.</div>;
  }

  return (
    <section className="container mx-auto p-4 md:p-10 flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
      {/* Sidebar */}
      <Sidebar />

      {/* Profile + Address Content */}
      <div className="flex-1 flex flex-col space-y-6">
        <ProfileDetails
          user={{
            _id: user._id,
            Name: user.name,
            Email: user.email,
          }}
        />
        <Addresses
          addresses={addresses}
          onAdd={handleAddAddress}
          onRemove={handleRemoveAddress}
        />
      </div>
    </section>
  );
};

export default ProfilePage;
