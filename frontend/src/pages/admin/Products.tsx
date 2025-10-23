import { useState } from "react";
import { useProducts } from "../../features/adminProducts/hooks/useProducts";
import ProductTable from "../../features/adminProducts/components/ProductTable";
import AddProductModal from "../../features/adminProducts/components/AddProductModal";
import EditProductModal from "../../features/adminProducts/components/EditProductModal";
import Pagination from "../../features/adminProducts/components/Pagination";

const ViewProducts = () => {
  const {
    products,
    loading, 
    actionLoading, 
    page,
    totalPages,
    addProduct,
    updateProduct,
    deleteProduct,
    setPage,
  } = useProducts();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  if (loading) {
    return <p className="text-center mt-20 text-gray-600">Loading products...</p>;
  }

  return (
    <section className="px-10 py-20">
      <div className="container mx-auto">
       <ul className="flex space-x-2 text-gray-500 mb-4 text-sm md:text-base">
          <li>Manage Products</li>
          <li>/</li>
          <li className="font-semibold text-gray-700">All Products</li>
        </ul>

        <div className="flex justify-end mb-6">
          <button
            onClick={() => setAddModalOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium"
          >
            Add Product
          </button>
        </div>

        <ProductTable
          products={products.map((p) => ({
            _id: p._id,
            Name: p.name,
            Price: p.price,
            Brand: p.brand ?? "-",
            mainCategory: p.category,
            imageUrl: p.images[0],
          }))}
          onDelete={deleteProduct}
          onEdit={(productId: string) => {
            const product = products.find((p) => p._id === productId);
            if (product) {
              setSelectedProduct(product);
              setEditModalOpen(true);
            }
          }}
        />

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

        <AddProductModal
          isOpen={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          onSubmit={addProduct}
          categories={[
            "Mobiles",
            "Fashion",
            "Electronics",
            "Home",
            "Beauty",
            "Furniture",
            "Flight Bookings",
            "Grocery",
          ]}
          loading={actionLoading} 
        />

        <EditProductModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSubmit={updateProduct}
          product={selectedProduct}
          categories={[
            "Mobiles",
            "Fashion",
            "Electronics",
            "Home",
            "Beauty",
            "Furniture",
            "Flight Bookings",
            "Grocery",
          ]}
          
        />
      </div>
    </section>
  );
};

export default ViewProducts;
