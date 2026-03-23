import { Link } from "react-router";
import { useEffect, useState } from "react";
import { Navigation } from "../components/navigation";
import { Hero } from "../components/hero";
import { useCart } from "../../context/cart-context";
import { Star, ArrowRight, Cpu, CircuitBoard, MemoryStick, HardDrive, Monitor, Gamepad2 } from "lucide-react";
import { Footer } from "../components/footer";

type Product = {
  _id: string;
  name: string;
  category: string;
  price: number;
  rating?: number;
  image: string;
  stock: number;
};

export function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();

  // FETCH PRODUCTS
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/products");
        const data = await res.json();

        if (res.ok && data.products) {
          setProducts(data.products.slice(0, 6));
        }
      } catch (err) {
        console.error("Fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = [
    { name: "CPU", icon: Cpu, path: "/products/cpu" },
    { name: "GPU", icon: Monitor, path: "/products/gpu" },
    { name: "Motherboard", icon: CircuitBoard, path: "/products/motherboard" },
    { name: "RAM", icon: MemoryStick, path: "/products/ram" },
    { name: "Storage", icon: HardDrive, path: "/products/storage" },
    { name: "Accessories", icon: Gamepad2, path: "/products/accessories" },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">

      <Navigation />

      {/* HERO */}
      <Hero />

      {/* FEATURED PRODUCTS */}
      <section className="px-6 py-16 max-w-7xl mx-auto">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Products</h2>

          <Link to="/products" className="text-[#22c55e] flex items-center gap-1">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        {/* STATES */}
        {loading ? (
          <p className="text-gray-400">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-red-400">No products found (Check API)</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">

            {products.map((product) => (
              <div
                key={product._id}
                className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-green-500/10 transition"
              >
                <Link to={`/product/${product._id}`}>
                  <img
                    src={product.image || "https://via.placeholder.com/300"}
                    className="h-48 w-full object-cover"
                  />
                </Link>

                <div className="p-4">
                  <p className="text-xs text-gray-400 mb-1">
                    {product.category}
                  </p>

                  <h3 className="font-semibold mb-2">
                    {product.name}
                  </h3>

                  {/* ⭐ RATING */}
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.floor(product.rating || 4)
                            ? "fill-[#22c55e] text-[#22c55e]"
                            : "text-gray-500"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex justify-between items-center mt-3">
                    <span className="text-lg font-bold text-[#22c55e]">
                      ₹{product.price.toLocaleString("en-IN")}
                    </span>

                    <button
                      onClick={() => addToCart(product._id)}
                      disabled={product.stock <= 0}
                      className={`px-3 py-1 text-sm rounded ${
                        product.stock > 0
                          ? "bg-[#22c55e] text-black"
                          : "bg-gray-600 cursor-not-allowed"
                      }`}
                    >
                      {product.stock > 0 ? "Add" : "Out"}
                    </button>
                  </div>
                </div>
              </div>
            ))}

          </div>
        )}
      </section>

      {/* CATEGORIES */}
      <section className="px-6 py-16 bg-[#111827]">

        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-8">
            Shop by Category
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-6">

            {categories.map((cat) => {
              const Icon = cat.icon;

              return (
                <Link
                  to={cat.path}
                  key={cat.name}
                  className="p-6 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] transition"
                >
                  <Icon className="mx-auto mb-3 text-[#22c55e]" size={28} />
                  <p>{cat.name}</p>
                </Link>
              );
            })}

          </div>
        </div>
      </section>

      <div>
        <Footer />
      </div>

    </div>
  );
}