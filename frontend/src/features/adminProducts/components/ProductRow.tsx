import { Link } from "react-router-dom";
import type { Product } from "../types/product";
import { FaTrash, FaPen } from "react-icons/fa";

interface Props {
  product: Product;
  index: number;
  onDelete: (id: string) => void;
}

const ProductRow = ({ product, index, onDelete }: Props) => {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="py-3 px-4 text-center">{index + 1}</td>
      <td className="py-3 px-4 text-gray-700">{product.Name}</td>
      <td className="py-3 px-4 flex justify-center">
        <img
          src={product.imageUrl}
          alt={product.Name}
          className="w-16 h-16 object-cover rounded-lg"
        />
      </td>
      <td className="py-3 px-4">₹{product.Price}</td>
      <td className="py-3 px-4">{product.Brand}</td>
      <td className="py-3 px-4">{product.mainCategory}</td>
      <td className="py-3 px-4 flex justify-center space-x-4">
        <Link
          to={`/admin/edit-product/${product._id}`}
          className="text-blue-600 hover:text-blue-800"
        >
          <FaPen />
        </Link>
        <button
          onClick={() => onDelete(product._id)}
          className="text-red-600 hover:text-red-800"
        >
          <FaTrash />
        </button>
      </td>
    </tr>
  );
};

export default ProductRow;
