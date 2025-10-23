import React, { useState } from "react";

export interface AddressData {
  name: string;
  number: string;
  street: string;
  town: string;
  city: string;
  state: string;
  pincode: string;
}

interface AddressFormProps {
  onSubmit: (data: AddressData) => void;
  loading?: boolean;
}

const AddressForm: React.FC<AddressFormProps> = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState<AddressData>({
    name: "",
    number: "",
    street: "",
    town: "",
    city: "",
    state: "",
    pincode: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div className="flex gap-4">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="flex-1 border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          name="number"
          placeholder="Mobile Number"
          value={formData.number}
          onChange={handleChange}
          className="flex-1 border px-3 py-2 rounded"
          required
        />
      </div>

      <input
        type="text"
        name="street"
        placeholder="Street Address"
        value={formData.street}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
        required
      />
      <input
        type="text"
        name="town"
        placeholder="Apartment, studio, or floor"
        value={formData.town}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
      />

      <div className="flex gap-4">
        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          className="flex-1 border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          name="state"
          placeholder="State"
          value={formData.state}
          onChange={handleChange}
          className="flex-1 border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          name="pincode"
          placeholder="Pincode"
          value={formData.pincode}
          onChange={handleChange}
          className="flex-1 border px-3 py-2 rounded"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
      >
        {loading ? "Saving..." : "Submit"}
      </button>
    </form>
  );
};

export default AddressForm;
