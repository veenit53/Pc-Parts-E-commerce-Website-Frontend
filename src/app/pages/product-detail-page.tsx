import { Link, useParams } from "react-router"
import { useEffect, useState } from "react"
import { ShoppingCart, ArrowLeft, Package, CheckCircle, XCircle, Minus, Plus, ChevronRight } from "lucide-react"
import { Navigation } from "../components/navigation"
import { useCart } from "../../context/cart-context"

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

type Product = {
  _id: string
  name: string
  price: number
  image: string
  description: string
  category: string
  stock: number
  brand?: string
  rating?: number
  reviews?: number
}

export function ProductDetailPage() {

  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [addedAnim, setAddedAnim] = useState(false)

  const { addToCart, removeFromCart, getQuantity, updateQuantity } = useCart()

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
        try {
          const res = await fetch(`${API}/products/${id}`)
        const data = await res.json()
        if (res.ok) setProduct(data.product)
      } catch (err) {
        console.error("Failed to fetch product", err)
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchProduct()
  }, [id])

  // ── Fetch related products (same category, exclude current) ────────────────
  useEffect(() => {
    if (!product) return
    const fetchRelated = async () => {
      try {
        const res = await fetch(`${API}/products`)
        const data = await res.json()
        const all: Product[] = data.products || []
        const filtered = all
          .filter(p =>
            p.category.toLowerCase() === product.category.toLowerCase() &&
            p._id !== product._id
          )
          .slice(0, 4)   // max 4 related
        setRelated(filtered)
      } catch (err) {
        console.error("Failed to fetch related products", err)
      }
    }
    fetchRelated()
  }, [product])

  const cartQty = product ? getQuantity(product._id) : 0

  const handleAddToCart = () => {
    if (!product) return
    addToCart(product._id)
    setAddedAnim(true)
    setTimeout(() => setAddedAnim(false), 1200)
  }

  const handleDecrease = () => {
    if (!product) return
    if (cartQty === 1) removeFromCart(product._id)
    else updateQuantity(product._id, cartQty - 1)
  }

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white">
        <Navigation />
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 gap-12 animate-pulse">
            <div className="aspect-square bg-[#111827] rounded-2xl" />
            <div className="space-y-4">
              <div className="h-4 w-24 bg-gray-800 rounded" />
              <div className="h-8 w-3/4 bg-gray-800 rounded" />
              <div className="h-6 w-32 bg-gray-800 rounded" />
              <div className="h-24 bg-gray-800 rounded" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center gap-4">
        <XCircle className="w-16 h-16 text-red-400" />
        <p className="text-xl font-semibold">Product not found</p>
        <Link to="/products" className="text-[#22c55e] hover:underline text-sm">
          ← Back to products
        </Link>
      </div>
    )
  }

  const inStock = product.stock > 0
  const categorySlug = product.category.toLowerCase().replace(/ /g, "-")

  // ────────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <Navigation />

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-white transition">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-white transition">Products</Link>
          <span>/</span>
          <Link to={`/products/${categorySlug}`} className="hover:text-white transition">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-gray-300 truncate max-w-[200px]">{product.name}</span>
        </div>

        {/* Back button */}
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-8 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>

        {/* ── MAIN PRODUCT SECTION ─────────────────────────────────────────── */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">

          {/* Image */}
          <div className="relative">
            <div className="aspect-square bg-[#111827] rounded-2xl border border-gray-800 overflow-hidden">
              <img
                src={product.image || "https://via.placeholder.com/500?text=No+Image"}
                alt={product.name}
                className="w-full h-full object-contain p-6"
              />
            </div>
            <div className={`absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
              inStock
                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                : "bg-red-500/10 text-red-400 border border-red-500/20"
            }`}>
              {inStock
                ? <><CheckCircle className="w-3 h-3" /> In Stock</>
                : <><XCircle className="w-3 h-3" /> Out of Stock</>
              }
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">

            <Link
              to={`/products/${categorySlug}`}
              className="inline-block w-fit text-xs font-semibold px-3 py-1 rounded-full bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20 mb-4 hover:bg-[#22c55e]/20 transition"
            >
              {product.category}
            </Link>

            <h1 className="text-3xl font-bold leading-tight mb-4">{product.name}</h1>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-bold text-[#22c55e]">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
            </div>

            <p className="text-gray-400 leading-relaxed mb-8 text-sm">{product.description}</p>

            <div className="flex items-center gap-2 text-sm mb-8">
              <Package className="w-4 h-4 text-gray-500" />
              {inStock ? (
                <span className="text-gray-400">
                  <span className="text-white font-semibold">{product.stock}</span> units available
                </span>
              ) : (
                <span className="text-red-400">Currently out of stock</span>
              )}
            </div>

            {/* Cart controls */}
            {inStock && (
              <div className="space-y-3">
                {cartQty === 0 ? (
                  <button
                    onClick={handleAddToCart}
                    className={`w-full py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2 transition-all duration-200 ${
                      addedAnim
                        ? "bg-green-600 scale-95 text-white"
                        : "bg-[#22c55e] hover:bg-[#16a34a] text-black"
                    }`}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {addedAnim ? "Added!" : "Add to Cart"}
                  </button>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center bg-[#111827] border border-gray-700 rounded-xl overflow-hidden">
                      <button
                        onClick={handleDecrease}
                        className="w-12 h-12 flex items-center justify-center hover:bg-gray-800 transition"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-semibold text-base">{cartQty}</span>
                      <button
                        onClick={handleAddToCart}
                        disabled={cartQty >= product.stock}
                        className={`w-12 h-12 flex items-center justify-center transition ${
                          cartQty >= product.stock
                            ? "text-gray-600 cursor-not-allowed"
                            : "hover:bg-gray-800 text-[#22c55e]"
                        }`}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-sm text-gray-400">
                      {cartQty} item{cartQty > 1 ? "s" : ""} in cart
                    </span>
                  </div>
                )}
                <Link to="/cart">
                  <button className="w-full py-3 rounded-xl border border-gray-700 text-sm font-medium hover:bg-gray-800 hover:border-gray-600 transition mt-2">
                    View Cart
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* ── RELATED PRODUCTS ─────────────────────────────────────────────── */}
        {related.length > 0 && (
          <section>
            {/* Section header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold">Related Products</h2>
                <p className="text-gray-500 text-sm mt-1">More from {product.category}</p>
              </div>
              <Link
                to={`/products/${categorySlug}`}
                className="flex items-center gap-1 text-sm text-[#22c55e] hover:underline"
              >
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-800 mb-8" />

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map(item => {
                const itemQty = getQuantity(item._id)
                return (
                  <Link key={item._id} to={`/product/${item._id}`}>
                    <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden hover:border-gray-600 hover:shadow-lg hover:shadow-green-500/5 transition-all duration-200 group h-full flex flex-col">

                      {/* Image */}
                      <div className="h-40 bg-gray-900 overflow-hidden">
                        <img
                          src={item.image || "https://via.placeholder.com/300?text=No+Image"}
                          alt={item.name}
                          className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <div className="p-4 flex flex-col flex-1">
                        <p className="text-xs text-gray-500 mb-1">{item.category}</p>
                        <h3 className="text-sm font-semibold leading-snug line-clamp-2 flex-1 mb-3">
                          {item.name}
                        </h3>

                        <div className="flex items-center justify-between mt-auto">
                          <span className="text-[#22c55e] font-bold text-sm">
                            ₹{item.price.toLocaleString("en-IN")}
                          </span>

                          {item.stock > 0 ? (
                            itemQty === 0 ? (
                              <button
                                onClick={e => { e.preventDefault(); addToCart(item._id) }}
                                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#22c55e] text-black hover:bg-[#16a34a] transition"
                              >
                                Add
                              </button>
                            ) : (
                              <div onClick={e => e.preventDefault()} className="flex items-center gap-1">
                                <button
                                  onClick={() =>
                                    itemQty === 1
                                      ? removeFromCart(item._id)
                                      : updateQuantity(item._id, itemQty - 1)
                                  }
                                  className="w-6 h-6 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded text-xs font-bold transition"
                                >
                                  −
                                </button>
                                <span className="w-6 text-center text-xs font-semibold">{itemQty}</span>
                                <button
                                  onClick={() => addToCart(item._id)}
                                  disabled={itemQty >= item.stock}
                                  className={`w-6 h-6 flex items-center justify-center rounded text-xs font-bold transition ${
                                    itemQty >= item.stock
                                      ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                                      : "bg-[#22c55e] text-black hover:bg-[#16a34a]"
                                  }`}
                                >
                                  +
                                </button>
                              </div>
                            )
                          ) : (
                            <span className="text-xs text-red-400">Out of Stock</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

      </div>
    </div>
  )
}