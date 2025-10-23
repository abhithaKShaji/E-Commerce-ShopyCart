import React from "react";

interface ProductProps {
  image: string;
  name: string;
  price: string;
}

const ProductCard: React.FC<ProductProps> = ({ image, name, price }) => {
  return (
    <div className="bg-white rounded-md p-3 shadow-sm hover:shadow-lg transition cursor-pointer">
      <img src={image} alt={name} className="h-40 mx-auto object-contain" />
      <div className="text-center mt-2">
        <h3 className="text-sm font-medium text-gray-800">{name}</h3>
        <p className="text-pink-600 font-semibold">{price}</p>
      </div>
    </div>
  );
};

export default ProductCard;
