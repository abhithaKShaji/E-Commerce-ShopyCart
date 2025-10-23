import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SidebarFilter from "../../components/common/SidebarFilter";
import ProductGrid from "../../features/products/components/ProductGrid";
import { useProductsByCategory } from "../../features/products/hooks/useProductsByCategory";

const ProductsPage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get("category") || undefined;

  const [category, setCategory] = useState<string | undefined>(categoryParam);

  const { products, loading, error } = useProductsByCategory(category);

  useEffect(() => {
    setCategory(categoryParam);
  }, [categoryParam]);

  return (
    <div className="flex flex-col md:flex-row max-w-[1400px] mx-auto mt-10 px-4 md:px-6 mb-20">

      <SidebarFilter onFilterChange={() => {}} />

      <div className="flex-1 min-h-screen">
        <h2 className="text-lg font-semibold mb-4 capitalize">
          {category ? category.replace("-", " ") : "All Products"}
        </h2>

        <ProductGrid products={products} loading={loading} error={error} />
      </div>
    </div>
  );
};

export default ProductsPage;
