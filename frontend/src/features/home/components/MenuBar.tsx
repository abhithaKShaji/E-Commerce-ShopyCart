import { useNavigate } from "react-router-dom";
import { menuItems } from "../data/menuItems";

const MenuBar = () => {
  const navigate = useNavigate();

  const handleMenuClick = (category: string) => {
    navigate(`/products-page?category=${category}`);
  };

  return (
    <div className="bg-white shadow-sm sticky top-0 z-20 overflow-x-auto">
      <div className="flex justify-start md:justify-center gap-10 px-6 py-5 min-w-max">
        {menuItems.map((item) => (
          <div
            key={item.label}
            className="flex flex-col items-center cursor-pointer hover:text-pink-600 transition-transform hover:scale-105"
            onClick={() => handleMenuClick(item.category)}
          >
            <div className="h-16 w-16 mb-2 flex items-center justify-center rounded-full bg-gray-50 shadow-sm hover:shadow-md transition">
              <img
                src={item.image}
                alt={item.label}
                className="h-12 w-12 object-contain"
                loading="lazy"
              />
            </div>
            <span className="text-sm font-medium text-gray-800 text-center whitespace-nowrap">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuBar;
