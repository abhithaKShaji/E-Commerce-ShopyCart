import { Pen, Trash2 } from "lucide-react";

interface ProductTableProps {
  products: any[];
  onDelete: (id: string) => void;
  onEdit?: (id: string) => void;
}

const ProductTable = ({ products, onDelete, onEdit }: ProductTableProps) => (
  <table className="min-w-full bg-white shadow rounded-lg">
    <thead>
      <tr className="bg-gray-100 text-left">
        <th className="px-4 py-2">Image</th>
        <th className="px-4 py-2">Name</th>
        <th className="px-4 py-2">Brand</th>
        <th className="px-4 py-2">Category</th>
        <th className="px-4 py-2">Price</th>
        <th className="px-4 py-2">Actions</th>
      </tr>
    </thead>

    <tbody>
      {products.map((product) => (
        <tr key={product._id} className="border-t hover:bg-gray-50">
          <td className="px-4 py-2">
            <img
              src={product.imageUrl}
              alt={product.Name}
              className="w-12 h-12 object-cover rounded"
            />
          </td>
          <td className="px-4 py-2 font-medium">{product.Name}</td>
          <td className="px-4 py-2">{product.Brand}</td>
          <td className="px-4 py-2">{product.mainCategory}</td>
          <td className="px-4 py-2 text-gray-700 font-semibold">
            ₹{product.Price}
          </td>

          
          <td className="px-4 py-2">
            <div className="flex items-center gap-3">
              {onEdit && (
                <button
                  onClick={() => onEdit(product._id)}
                  className="text-blue-500 hover:text-blue-700 transition-colors"
                  title="Edit"
                >
                  <Pen size={18} />
                </button>
              )}
              <button
                onClick={() => onDelete(product._id)}
                className="text-red-500 hover:text-red-700 transition-colors"
                title="Delete"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default ProductTable;
