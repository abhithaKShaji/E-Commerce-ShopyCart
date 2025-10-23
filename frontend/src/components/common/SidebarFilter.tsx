import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

interface SidebarFilterProps {
  onFilterChange: (filters: {
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
  }) => void;
}

const SidebarFilter: React.FC<SidebarFilterProps> = ({ onFilterChange }) => {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [priceRange, setPriceRange] = useState<number>(25000);

  const brandOptions: Record<string, string[]> = {
    Mobiles: ["Samsung", "Apple", "Realme", "OnePlus", "Xiaomi"],
    Laptops: ["HP", "Dell", "Lenovo", "Asus", "Apple"],
    Shoes: ["Nike", "Adidas", "Puma", "Reebok"],
    Accessories: ["Boat", "Noise", "Fossil", "Titan"],
  };

  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
      onFilterChange({ category: categoryFromUrl, maxPrice: priceRange });
    }
  }, [searchParams]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedBrand("");
    onFilterChange({ category, maxPrice: priceRange });
  };

  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    onFilterChange({ category: selectedCategory, brand, maxPrice: priceRange });
  };

  const handlePriceChange = (value: number) => {
    setPriceRange(value);
    onFilterChange({
      category: selectedCategory,
      brand: selectedBrand,
      minPrice: 0,
      maxPrice: value,
    });
  };

  const handleClearFilters = () => {
    setSelectedCategory("");
    setSelectedBrand("");
    setPriceRange(25000);
    onFilterChange({});
  };

  return (
    <aside className="w-full md:w-1/4 lg:w-1/5 border rounded-lg shadow-sm p-5 mb-6 md:mb-0 md:mr-6 bg-white">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>

      <div className="text-sm text-gray-600 mb-4">
        {selectedCategory ? (
          <p>
            <span className="font-medium text-gray-800">Category</span> &gt;{" "}
            <span className="text-pink-600 font-semibold">
              {selectedCategory}
            </span>
          </p>
        ) : (
          <p className="text-gray-500">Select a category</p>
        )}
      </div>

      <div className="mb-6">
        <h3 className="font-medium text-gray-800 mb-2">Category</h3>
        <ul className="space-y-1 text-sm text-gray-700">
          {Object.keys(brandOptions).map((cat) => (
            <li key={cat}>
              <input
                type="radio"
                name="category"
                checked={selectedCategory === cat}
                onChange={() => handleCategoryChange(cat)}
                className="mr-2 accent-pink-600"
              />
              {cat}
            </li>
          ))}
        </ul>
      </div>

      {selectedCategory && (
        <div className="mb-6">
          <h3 className="font-medium text-gray-800 mb-2">Brand</h3>
          <ul className="space-y-1 text-sm text-gray-700">
            {brandOptions[selectedCategory]?.map((b) => (
              <li key={b}>
                <input
                  type="radio"
                  name="brand"
                  checked={selectedBrand === b}
                  onChange={() => handleBrandChange(b)}
                  className="mr-2 accent-pink-600"
                />
                {b}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mb-6">
        <h3 className="font-medium text-gray-800 mb-2">Price</h3>
        <input
          type="range"
          min={5000}
          max={100000}
          step={1000}
          value={priceRange}
          onChange={(e) => handlePriceChange(Number(e.target.value))}
          className="w-full accent-pink-600"
        />
        <p className="text-sm mt-2 text-gray-600">Up to ₹{priceRange}</p>
      </div>

      <button
        onClick={handleClearFilters}
        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium py-2 rounded transition"
      >
        Clear Filters
      </button>
    </aside>
  );
};

export default SidebarFilter;
