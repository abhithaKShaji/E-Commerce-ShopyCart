import { Banner, MenuBar, ProductCard } from "../../features/home";
import DealsGroup from "../../features/home/components/DealsGroup";
import SidePromoBanner from "../../features/home/components/SidePromoBanner";
import { homeDecorDeals } from "../../features/home/data/dealsData";
import { useProductsByCategory } from "../../features/products/hooks/useProductsByCategory";
import { useNavigate } from "react-router-dom";

function SkeletonCard() {
  return (
    <div className="animate-pulse space-y-2 cursor-pointer">
      <div className="bg-gray-300 h-40 w-full rounded-md"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
    </div>
  );
}

function Home() {
  const navigate = useNavigate();

  const {
    products: mobileProducts,
    loading: mobileLoading,
    error: mobileError,
  } = useProductsByCategory("mobiles");

  const {
    products: fashionProducts,
    loading: fashionLoading,
    error: fashionError,
  } = useProductsByCategory("fashion");

  return (
    <div className="bg-gray-50 min-h-screen">
      <MenuBar />
      <Banner />

      {/* Mobile Deals Section */}
      <section className="bg-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-semibold mb-4">Best Deals on Smartphones</h2>

          {mobileLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, idx) => (
                <SkeletonCard key={idx} />
              ))}
            </div>
          ) : mobileError ? (
            <div className="text-red-500">{mobileError}</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {mobileProducts.slice(0, 10).map((p) => (
                <div
                  key={p._id}
                  onClick={() => navigate(`/view-product/${p._id}`)}
                  className="cursor-pointer"
                >
                  <ProductCard
                    image={p.images?.[0]}
                    name={p.name}
                    price={`₹${p.price}`}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Banner />

      {/* Fashion Deals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Fashion’s Top Deals</h2>

              {fashionLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Array.from({ length: 8 }).map((_, idx) => (
                    <SkeletonCard key={idx} />
                  ))}
                </div>
              ) : fashionError ? (
                <div className="text-red-500">{fashionError}</div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {fashionProducts.slice(0, 8).map((p) => (
                    <div
                      key={p._id}
                      onClick={() => navigate(`/view-product/${p._id}`)}
                      className="cursor-pointer"
                    >
                      <ProductCard
                        image={p.images?.[0]}
                        name={p.name}
                        price={`₹${p.price}`}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <DealsGroup title="Home Decor & Furnishing" deals={homeDecorDeals} />
          </div>

          {/* Sidebar banner for large screens */}
          <div className="hidden lg:block">
            <SidePromoBanner />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
