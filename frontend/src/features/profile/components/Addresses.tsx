import React, { useState } from "react";
import AddressForm from "./AddressForm";
import { FaHome, FaPlus, FaPen, FaTrash } from "react-icons/fa";
import { useAddresses } from "../../checkout/hooks/useAddress";
import { useAddAddress, type AddressData } from "../../checkout/hooks/useAddAddress";
import { useDeleteAddress } from "../../checkout/hooks/useDeleteAddress";

interface Props {}



const Addresses: React.FC<Props> = () => {
  const { addresses, loading, error, fetchAddresses } = useAddresses();
  const { addAddress, loading: adding, error: addError } = useAddAddress();
  const { deleteAddress, loading: deleting } = useDeleteAddress();

  const [showForm, setShowForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ show: boolean; id?: string }>({ show: false });

  const handleAddAddress = async (data: AddressData) => {
    try {
      await addAddress(data);
      fetchAddresses();
      setShowForm(false);
    } catch (err) {
      console.error("Failed to add address:", err);
    }
  };

  const handleConfirmDelete = (id: string) => {
    setConfirmDelete({ show: true, id });
  };

  const handleDeleteAddress = async () => {
    if (!confirmDelete.id) return;
    try {
      const token = localStorage.getItem("user_token") || "";
      await deleteAddress(confirmDelete.id, token);
      fetchAddresses();
    } catch (err) {
      console.error("Failed to delete address:", err);
    } finally {
      setConfirmDelete({ show: false });
    }
  };

  if (loading) return <p className="text-center mt-4 text-gray-600">Loading addresses...</p>;
  if (error) return <p className="text-center mt-4 text-red-500">{error}</p>;

  return (
    <div className="mt-6 w-full">
      <div className="flex justify-between items-center mb-2 text-lg font-semibold">
        <p className="flex items-center space-x-2">
          <FaHome /> <span>My Addresses</span>
        </p>
        <button
          className="flex items-center px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={() => setShowForm(true)}
        >
          <FaPlus /> <span className="ml-1">Add New Address</span>
        </button>
      </div>

      <div className="space-y-4">
        {addresses.length === 0 && <p className="text-gray-500">No addresses found.</p>}
        {addresses.map((addr) => (
          <div key={addr._id} className="p-4 bg-white rounded shadow">
            <h5 className="font-semibold">{addr.name}</h5>
            <p>
              {addr.street}, {addr.town} <br />
              {addr.city}, {addr.pincode} <br />
              {addr.state}
            </p>
            <h5 className="mt-1">+91-{addr.number}</h5>
            <div className="flex space-x-4 mt-2">
              <button className="flex items-center space-x-1 text-blue-600">
                <FaPen /> <span>Edit</span>
              </button>
              <button
                className="flex items-center space-x-1 text-red-600 disabled:opacity-50"
                onClick={() => handleConfirmDelete(addr._id)}
                disabled={deleting}
              >
                <FaTrash /> <span>Remove</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <AddressForm onAdd={handleAddAddress} onClose={() => setShowForm(false)} />
      )}

      {confirmDelete.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-4">Are you sure you want to remove this address?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmDelete({ show: false })}
                className="px-3 py-1 rounded bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAddress}
                className="px-3 py-1 rounded bg-red-600 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {adding && <p className="text-gray-500 mt-2">Adding address...</p>}
      {addError && <p className="text-red-500 mt-2">{addError}</p>}
    </div>
  );
};

export default Addresses;
