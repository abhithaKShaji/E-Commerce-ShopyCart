import React, { useState } from "react";
import type { Address } from "../types";

interface Props {
  onAdd: (address: Address) => void;
  onClose: () => void;
}

const AddressForm: React.FC<Props> = ({ onAdd, onClose }) => {
  const [form, setForm] = useState({
    name: "",
    number: "",
    street: "",
    town: "",
    city: "",
    pincode: "",
    state: "",
    isDefault: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ ...form, id: Date.now().toString() });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50  flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Add New Address</h3>
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            type="text"
            name="name"
            placeholder="Name *"
            className="w-full border p-2 rounded"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="number"
            placeholder="Mobile *"
            className="w-full border p-2 rounded"
            value={form.number}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="street"
            placeholder="House No, Street, Area *"
            className="w-full border p-2 rounded"
            value={form.street}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="town"
            placeholder="Locality/Town *"
            className="w-full border p-2 rounded"
            value={form.town}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="city"
            placeholder="City/District *"
            className="w-full border p-2 rounded"
            value={form.city}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="pincode"
            placeholder="Pincode *"
            className="w-full border p-2 rounded"
            value={form.pincode}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="state"
            placeholder="State *"
            className="w-full border p-2 rounded"
            value={form.state}
            onChange={handleChange}
            required
          />
          <div className="flex items-center justify-between mt-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="isDefault"
                checked={form.isDefault}
                onChange={handleChange}
              />
              <span>Set as default address</span>
            </label>
            <div className="space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1 rounded bg-gray-300"
              >
                Cancel
              </button>
              <button type="submit" className="px-3 py-1 rounded bg-blue-600 text-white">
                Add
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressForm;
