import { Link } from "react-router-dom";

const ProductHeader = () => {
  return (
    <div className="flex justify-end mb-6">
      <Link
        to="/admin/add-product"
        className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium"
      >
        Add Product
      </Link>
    </div>
  );
};

export default ProductHeader;
