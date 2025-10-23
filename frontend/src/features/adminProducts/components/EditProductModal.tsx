import { useState, useEffect } from "react";

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, formData: FormData) => Promise<void>;
  product: any | null;
  categories: string[];
}

const EditProductModal = ({
  isOpen,
  onClose,
  onSubmit,
  product,
  categories,
}: EditProductModalProps) => {
  const [form, setForm] = useState({
    name: "",
    brand: "",
    description: "",
    price: "",
    category: "",
    images: [] as File[],
  });

  
  const [existingImages, setExistingImages] = useState<string[]>([]);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        brand: product.brand || "",
        description: product.description || "",
        price: product.price?.toString() || "",
        category: product.category || "",
        images: [],
      });
      setExistingImages(product.images || []);
    }
  }, [product]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setForm((prev) => ({ ...prev, images: Array.from(e.target.files!) }));
    }
  };

  
  const handleRemoveExistingImage = (url: string) => {
    setExistingImages((prev) => prev.filter((img) => img !== url));
  };

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("brand", form.brand);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("category", form.category);

    
    form.images.forEach((file) => formData.append("images", file));

    
    existingImages.forEach((url) => formData.append("existingImages[]", url));

    await onSubmit(product._id, formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40  flex justify-center items-center z-50">
      <div className="bg-white w-[500px] rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Edit Product</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Product Name"
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="brand"
            value={form.brand}
            onChange={handleChange}
            placeholder="Brand"
            className="w-full border px-3 py-2 rounded"
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            className="w-full border px-3 py-2 rounded"
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat.toLowerCase()}>
                {cat}
              </option>
            ))}
          </select>

          
          {existingImages.length > 0 && (
            <div>
              <p className="font-medium mb-2">Existing Images:</p>
              <div className="flex flex-wrap gap-3">
                {existingImages.map((imgUrl, i) => (
                  <div key={i} className="relative">
                    <img
                      src={imgUrl}
                      alt={`Product ${i}`}
                      className="w-20 h-20 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(imgUrl)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        
          <input
            type="file"
            name="images"
            multiple
            onChange={handleFileChange}
            className="w-full border px-3 py-2 rounded"
          />

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
