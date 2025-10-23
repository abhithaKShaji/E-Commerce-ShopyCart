import { Search, ShoppingCart, User, ChevronDown, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useCartContext } from "../../context/CartContext";
import { useUserAuth } from "../../context/UserAuthContext";
import { useProductSearch } from "../../features/products/hooks/useProductSearch";

const MainHeader: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useUserAuth();
  const { cart } = useCartContext();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Search
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const { products: searchResults, loading: searchLoading } = useProductSearch(searchQuery);

  const handleUserClick = () => {
    if (!user) navigate("/login");
    else setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/");
  };

  const totalItems = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <span className="text-sm text-gray-500 font-semibold">
            Shopy <span className="text-pink-500">Cart</span>
          </span>
        </div>

        {/* Search bar - hidden on mobile, shown on sm+ */}
        <div className="relative flex-1 mx-4 hidden sm:block">
          <div className="flex items-center bg-blue-50 px-3 py-2 rounded w-full">
            <Search className="text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search for Products, Brands and More"
              className="bg-transparent outline-none ml-2 w-full text-sm"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => searchQuery && setShowResults(true)}
            />
          </div>

          {showResults && searchQuery && (
            <div className="absolute z-50 w-full bg-white border rounded shadow mt-1 max-h-60 overflow-y-auto">
              {searchLoading ? (
                <div className="p-2 text-gray-500">Loading...</div>
              ) : searchResults.length > 0 ? (
                searchResults.map((product) => (
                  <div
                    key={product._id}
                    className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                    onMouseDown={() => {
                      navigate(`/view-product/${product._id}`);
                      setShowResults(false);
                      setSearchQuery("");
                    }}
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <span className="text-sm">{product.name}</span>
                  </div>
                ))
              ) : (
                <div className="p-2 text-gray-500">No products found</div>
              )}
            </div>
          )}
        </div>

        {/* Desktop menu */}
        <div className="hidden sm:flex items-center gap-6">
          {/* User */}
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center gap-1 text-gray-700 hover:text-pink-600"
              onClick={handleUserClick}
            >
              {user ? (
                <>
                  <User size={18} /> {user.name} <ChevronDown size={14} />
                </>
              ) : (
                <>
                  <User size={18} /> Login
                </>
              )}
            </button>

            {user && dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg py-2 z-50">
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                  onClick={() => navigate("/profile")}
                >
                  Profile
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-500"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Cart */}
          <button
            className="relative flex items-center gap-1 text-gray-700 hover:text-pink-600"
            onClick={() => (user ? navigate("/cart") : navigate("/login"))}
          >
            <ShoppingCart size={20} />
            <span>Cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
                {totalItems}
              </span>
            )}
          </button>

          <button
            className="text-gray-700 hover:text-pink-600 font-medium"
            onClick={() => navigate("/seller")}
          >
            Become a Seller
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="sm:hidden flex items-center">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-t shadow-md px-4 py-4 space-y-3">
          {/* Search */}
          <div className="flex items-center bg-blue-50 px-3 py-2 rounded w-full">
            <Search className="text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search for Products, Brands and More"
              className="bg-transparent outline-none ml-2 w-full text-sm"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => searchQuery && setShowResults(true)}
            />
          </div>

          {/* User / Profile */}
          <button
            className="flex items-center gap-2 text-gray-700 hover:text-pink-600 w-full"
            onClick={handleUserClick}
          >
            <User size={18} /> {user ? "Profile" : "Login"}
          </button>

          {/* Cart */}
          <button
            className="flex items-center gap-2 text-gray-700 hover:text-pink-600 w-full"
            onClick={() => (user ? navigate("/cart") : navigate("/login"))}
          >
            <ShoppingCart size={18} /> Cart
            {totalItems > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs font-bold rounded-full px-1 py-0.5">
                {totalItems}
              </span>
            )}
          </button>

          <button
            className="w-full text-gray-700 hover:text-pink-600 font-medium text-left"
            onClick={() => navigate("/seller")}
          >
            Become a Seller
          </button>
        </div>
      )}
    </header>
  );
};

export default MainHeader;
