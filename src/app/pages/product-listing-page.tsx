import { Link, useParams, useNavigate } from "react-router"
import { useEffect, useState } from "react"
import { Star, SlidersHorizontal, X, ChevronDown } from "lucide-react"
import { Navigation } from "../components/navigation"
import { useCart } from "../../context/cart-context"
import { Footer } from "../components/footer"
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const ALL_CATEGORIES = ["CPU", "GPU", "Motherboard", "RAM", "Storage", "Power Supply", "Cabinet"]

const PRICE_RANGES = [
  { label: "Under ₹5,000",    min: 0,      max: 5000   },
  { label: "₹5,000 – ₹15,000", min: 5000,  max: 15000  },
  { label: "₹15,000 – ₹50,000",min: 15000, max: 50000  },
  { label: "₹50,000 – ₹1,00,000", min: 50000, max: 100000 },
  { label: "Above ₹1,00,000", min: 100000, max: Infinity },
]

export function ProductListingPage() {

  const { category } = useParams()   // e.g. "cpu", "power-supply"
  const navigate = useNavigate()

  const [products, setProducts] = useState<any[]>([])
  const [sort, setSort] = useState("popularity")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const { addToCart, removeFromCart, getQuantity, updateQuantity } = useCart()

  const slugToCategory = (slug: string) =>
    ALL_CATEGORIES.find(
      c => c.toLowerCase().replace(/ /g, "-") === slug.toLowerCase()
    ) ?? slug

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API}/products`)
        const data = await res.json()
        setProducts(data.products || [])
      } catch (err) {
        console.error("Failed to fetch products", err)
      }
    }
    fetchProducts()
  }, [])

  useEffect(() => {
    if (category) {
      const matched = slugToCategory(category)
      setSelectedCategories([matched])
    } else {
      setSelectedCategories([])
    }
  }, [category])

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
  }

  const filtered = products.filter(p => {
    const catMatch = selectedCategories.length === 0 ||
      selectedCategories.some(c => c.toLowerCase() === p.category.toLowerCase())

    const priceMatch = selectedPriceRange === null ||
      (p.price >= PRICE_RANGES[selectedPriceRange].min &&
       p.price < PRICE_RANGES[selectedPriceRange].max)

    return catMatch && priceMatch
  })

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "low")    return a.price - b.price
    if (sort === "high")   return b.price - a.price
    if (sort === "rating") return (b.rating ?? 0) - (a.rating ?? 0)
    return 0  // popularity = default order from API
  })

  const pageTitle = selectedCategories.length === 1
    ? selectedCategories[0]
    : selectedCategories.length > 1
    ? "Filtered Products"
    : "All Products"

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedPriceRange(null)
    if (category) navigate("/products")
  }

  const hasActiveFilters = selectedCategories.length > 0 || selectedPriceRange !== null


  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <Navigation />

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">{pageTitle}</h1>
            <p className="text-gray-400 text-sm mt-1">
              {sorted.length} product{sorted.length !== 1 ? "s" : ""} found
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-[#111827] border border-gray-700 rounded-lg text-sm"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="w-5 h-5 rounded-full bg-[#22c55e] text-black text-xs flex items-center justify-center font-bold">
                  {selectedCategories.length + (selectedPriceRange !== null ? 1 : 0)}
                </span>
              )}
            </button>

            {/* Sort dropdown */}
            <div className="relative">
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="appearance-none bg-[#111827] border border-gray-700 rounded-lg px-4 py-2 pr-8 text-sm cursor-pointer focus:outline-none focus:border-[#22c55e]"
              >
                <option value="popularity">Most Popular</option>
                <option value="low">Price: Low → High</option>
                <option value="high">Price: High → Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
            </div>
          </div>
        </div>

        {/* Active filter pills */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedCategories.map(cat => (
              <span
                key={cat}
                onClick={() => toggleCategory(cat)}
                className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#22c55e]/10 border border-[#22c55e]/30 text-[#22c55e] text-xs cursor-pointer hover:bg-[#22c55e]/20"
              >
                {cat} <X className="w-3 h-3" />
              </span>
            ))}
            {selectedPriceRange !== null && (
              <span
                onClick={() => setSelectedPriceRange(null)}
                className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#22c55e]/10 border border-[#22c55e]/30 text-[#22c55e] text-xs cursor-pointer hover:bg-[#22c55e]/20"
              >
                {PRICE_RANGES[selectedPriceRange].label} <X className="w-3 h-3" />
              </span>
            )}
            <button
              onClick={clearFilters}
              className="px-3 py-1 rounded-full bg-gray-800 text-gray-400 text-xs hover:text-white hover:bg-gray-700 transition"
            >
              Clear all
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* ── SIDEBAR ─────────────────────────────────────────────────────── */}

          {/* Mobile overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <aside
            className={`
              fixed top-0 left-0 h-full w-72 bg-[#0f172a] z-50 p-6 overflow-y-auto transition-transform duration-300 lg:static lg:h-auto lg:w-auto lg:bg-transparent lg:z-auto lg:p-0 lg:translate-x-0
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            `}
          >
            <div className="bg-[#111827] p-6 rounded-xl border border-gray-800">

              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold">Filters</h2>
                <div className="flex items-center gap-2">
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-xs text-[#22c55e] hover:underline"
                    >
                      Clear all
                    </button>
                  )}
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="lg:hidden text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Category filter */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                  Category
                </h3>
                <div className="space-y-2">
                  {ALL_CATEGORIES.map(cat => (
                    <label
                      key={cat}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <div
                        onClick={() => toggleCategory(cat)}
                        className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                          selectedCategories.includes(cat)
                            ? "border-[#22c55e] bg-[#22c55e]"
                            : "border-gray-600 group-hover:border-gray-400"
                        }`}
                      >
                        {selectedCategories.includes(cat) && (
                          <svg className="w-2.5 h-2.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span
                        onClick={() => toggleCategory(cat)}
                        className={`text-sm transition-colors ${
                          selectedCategories.includes(cat) ? "text-white" : "text-gray-400 group-hover:text-white"
                        }`}
                      >
                        {cat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price filter */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                  Price Range
                </h3>
                <div className="space-y-2">
                  {PRICE_RANGES.map((range, i) => (
                    <label key={i} className="flex items-center gap-3 cursor-pointer group">
                      <div
                        onClick={() => setSelectedPriceRange(selectedPriceRange === i ? null : i)}
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                          selectedPriceRange === i
                            ? "border-[#22c55e] bg-[#22c55e]"
                            : "border-gray-600 group-hover:border-gray-400"
                        }`}
                      >
                        {selectedPriceRange === i && (
                          <div className="w-1.5 h-1.5 rounded-full bg-black" />
                        )}
                      </div>
                      <span
                        onClick={() => setSelectedPriceRange(selectedPriceRange === i ? null : i)}
                        className={`text-sm transition-colors ${
                          selectedPriceRange === i ? "text-white" : "text-gray-400 group-hover:text-white"
                        }`}
                      >
                        {range.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* ── PRODUCT GRID ─────────────────────────────────────────────────── */}
          <div className="lg:col-span-3">

            {sorted.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <p className="text-gray-500 text-lg mb-2">No products found</p>
                <p className="text-gray-600 text-sm mb-6">Try adjusting your filters</p>
                <button
                  onClick={clearFilters}
                  className="px-5 py-2 bg-[#22c55e] text-black rounded-lg font-medium text-sm"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sorted.map(product => (
                  <Link key={product._id} to={`/product/${product._id}`}>
                    <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden hover:border-gray-600 hover:shadow-lg hover:shadow-green-500/5 transition-all duration-200 group">

                      {/* Image */}
                      <div className="h-48 overflow-hidden bg-gray-900">
                        <img
                          src={product.image || "https://via.placeholder.com/300x200?text=No+Image"}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <div className="p-4">
                        <p className="text-xs text-gray-500 mb-1">{product.category}</p>
                        <h3 className="font-semibold text-sm mb-2 line-clamp-2 leading-snug">
                          {product.name}
                        </h3>

                        {/* Rating */}
                        {product.rating > 0 && (
                          <div className="flex items-center gap-1 mb-3">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < Math.floor(product.rating)
                                    ? "fill-[#22c55e] text-[#22c55e]"
                                    : "text-gray-600"
                                }`}
                              />
                            ))}
                            {product.reviews > 0 && (
                              <span className="text-xs text-gray-500 ml-1">
                                ({product.reviews})
                              </span>
                            )}
                          </div>
                        )}

                        {/* Price + Cart */}
                        <div className="flex justify-between items-center mt-3">
                          <span className="text-lg font-bold text-[#22c55e]">
                            ₹{Number(product.price).toLocaleString("en-IN")}
                          </span>

                          {product.stock > 0 ? (
                            getQuantity(product._id) === 0 ? (
                              <button
                                onClick={e => { e.preventDefault(); addToCart(product._id) }}
                                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#22c55e] text-black hover:bg-[#16a34a] transition"
                              >
                                Add to Cart
                              </button>
                            ) : (
                              <div onClick={e => e.preventDefault()} className="flex items-center gap-1">
                                <button
                                  onClick={() => {
                                    const qty = getQuantity(product._id)
                                    qty === 1
                                      ? removeFromCart(product._id)
                                      : updateQuantity(product._id, qty - 1)
                                  }}
                                  className="w-7 h-7 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded text-sm font-bold transition"
                                >
                                  −
                                </button>
                                <span className="w-7 text-center text-sm font-semibold">
                                  {getQuantity(product._id)}
                                </span>
                                <button
                                  onClick={() => addToCart(product._id)}
                                  disabled={getQuantity(product._id) >= product.stock}
                                  className={`w-7 h-7 flex items-center justify-center rounded text-sm font-bold transition ${
                                    getQuantity(product._id) >= product.stock
                                      ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                                      : "bg-[#22c55e] text-black hover:bg-[#16a34a]"
                                  }`}
                                >
                                  +
                                </button>
                              </div>
                            )
                          ) : (
                            <span className="text-xs text-red-400 font-medium">Out of Stock</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      <Footer />
    </div>
  )
}