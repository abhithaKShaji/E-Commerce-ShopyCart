import React from "react";
import { useParams } from "react-router-dom";
import { useSingleProduct } from "../../features/products/hooks/useSingleProduct";
import ProductImages from "../../features/products/components/ProductImages";
import ProductDetails from "../../features/products/components/ProductDetails";
import ViewProductSkeleton from "../../features/products/components/ViewProductSkeleton";

const ViewProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { product, loading, error } = useSingleProduct(id || "");

  if (loading) return <ViewProductSkeleton />;

  if (error)
    return (
      <div className="min-h-screen flex justify-center items-center text-red-500">
        {error}
      </div>
    );

  if (!product)
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-500">
        Product not found.
      </div>
    );

  return (
    <section className="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row gap-10">
      <ProductImages images={product.images} />
      <ProductDetails product={product} />
    </section>
  );
};

export default ViewProduct;
