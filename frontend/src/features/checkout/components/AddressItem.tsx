import React from "react";
import type { Address } from "../hooks/useAddress";
import { useDeleteAddress } from "../hooks/useDeleteAddress";
//import { useUserAuth } from "../../../context/UserAuthContext";

interface AddressItemProps {
  address: Address & { id: string };
  selected: boolean;
  onSelect: (id: string) => void;
  onRemove?: () => void;
}

const AddressItem: React.FC<AddressItemProps> = ({
  address,
  selected,
  onSelect,
  onRemove,
}) => {
  const { deleteAddress, loading } = useDeleteAddress();
  //const { user } = useUserAuth();

  const handleRemove = async () => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;

    
    const token = localStorage.getItem("user_token");

    if (!token) {
      alert("You must be logged in to delete an address.");
      return;
    }

    try {
      await deleteAddress(address.id, token);
      alert("Address deleted successfully!");
      onRemove?.();
    } catch (err: any) {
      console.error(" Delete address failed:", err);
      alert(
        err?.response?.data?.message ||
          "Failed to delete address. Please try again."
      );
    }
  };

  return (
    <div
      className={`flex items-start gap-4 p-4 border rounded-lg mt-3 transition-colors ${
        selected ? "border-pink-500 bg-pink-50" : "border-gray-300 bg-white"
      }`}
    >
      <input
        type="radio"
        name="address"
        checked={selected}
        onChange={() => onSelect(address.id)}
        className="mt-1 accent-pink-500 cursor-pointer"
      />
      <div className="flex-1">
        <h3 className="font-semibold text-gray-800">{address.name}</h3>
        <p className="text-sm text-gray-600">
          {address.street}, {address.town}, {address.city}, {address.state} -{" "}
          {address.pincode}
        </p>
        <p className="text-sm font-medium text-gray-700 mt-1">
          Mobile: +91-{address.number}
        </p>

        <button
          onClick={handleRemove}
          disabled={loading}
          className={`mt-2 text-sm font-medium ${
            loading
              ? "text-gray-400 cursor-not-allowed"
              : "text-red-500 hover:text-red-600"
          }`}
        >
          {loading ? "Removing..." : "Remove"}
        </button>
      </div>
    </div>
  );
};

export default AddressItem;
