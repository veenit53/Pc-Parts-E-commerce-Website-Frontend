import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router"
import { Navigation } from "../components/navigation"
import { useCart } from "../../context/cart-context"
import {
  ChevronRight, Cpu, Monitor, CircuitBoard,
  MemoryStick, HardDrive, Zap, Box, Check, Save, ShoppingCart
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

type Product = {
  _id: string
  name: string
  price: number
  category: string
  image?: string
  stock: number
}

type SelectedBuild = {
  [category: string]: Product
}

// ─── Category Config ──────────────────────────────────────────────────────────

const CATEGORIES = [
  { key: "CPU",          label: "CPU",          icon: Cpu,           color: "#f97316" },
  { key: "GPU",          label: "GPU",           icon: Monitor,       color: "#a855f7" },
  { key: "Motherboard",  label: "Motherboard",   icon: CircuitBoard,  color: "#3b82f6" },
  { key: "RAM",          label: "RAM",           icon: MemoryStick,   color: "#22c55e" },
  { key: "Storage",      label: "Storage",       icon: HardDrive,     color: "#eab308" },
  { key: "Power Supply", label: "Power Supply",  icon: Zap,           color: "#ec4899" },
  { key: "Cabinet",      label: "Cabinet",       icon: Box,           color: "#14b8a6" },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Converts "Power Supply" → "power-supply" for URL
const categoryToSlug = (key: string) =>
  key.toLowerCase().replace(/ /g, "-")

// ─── Component ────────────────────────────────────────────────────────────────

export function PCBuilderPage() {
  const { addToCart } = useCart()
  const navigate = useNavigate()

  const [productsByCategory, setProductsByCategory] = useState<Record<string, Product[]>>({})
  const [selected, setSelected] = useState<SelectedBuild>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // ── Fetch all products, group by category ───────────────────────────────────
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await fetch("http://localhost:5000/products")
        const data = await res.json()
        const all: Product[] = data.products || []

        const grouped: Record<string, Product[]> = {}
        CATEGORIES.forEach(({ key }) => {
          grouped[key] = all.filter(
            p => p.category.toLowerCase() === key.toLowerCase()
          )
        })
        setProductsByCategory(grouped)
      } catch (err) {
        console.error("Failed to fetch products", err)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  // ── Load user's saved build on mount ────────────────────────────────────────
  useEffect(() => {
    const loadSavedBuild = async () => {
      const token = localStorage.getItem("token")
      if (!token) return
      try {
        const res = await fetch("http://localhost:5000/builds/my-build", {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!res.ok) return
        const data = await res.json()
        if (data.build?.components) {
          setSelected(data.build.components)
        }
      } catch (err) {
        console.error("Failed to load saved build", err)
      }
    }
    loadSavedBuild()
  }, [])

  // ── Select / deselect a component ───────────────────────────────────────────
  const handleSelect = (category: string, item: Product) => {
    setSelected(prev => {
      // Clicking same item deselects it
      if (prev[category]?._id === item._id) {
        const next = { ...prev }
        delete next[category]
        return next
      }
      return { ...prev, [category]: item }
    })
    setSaveSuccess(false)
  }

  const total = Object.values(selected).reduce((sum, item) => sum + item.price, 0)
  const selectedCount = Object.keys(selected).length

  // ── Save build to user profile ───────────────────────────────────────────────
  const handleSaveBuild = async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      alert("Please login to save your build")
      navigate("/login")
      return
    }
    if (selectedCount === 0) return

    setSaving(true)
    try {
      const res = await fetch("http://localhost:5000/builds/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ components: selected })
      })
      if (res.ok) {
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 3000)
      } else {
        const data = await res.json()
        alert(data.message || "Failed to save build")
      }
    } catch (err) {
      console.error("Save build error", err)
    } finally {
      setSaving(false)
    }
  }

  // ── Add all selected items to cart ──────────────────────────────────────────
  const handleAddAll = () => {
    Object.values(selected).forEach(item => addToCart(item._id))
  }

  // ────────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <Navigation />

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* PAGE HEADER */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Build Your PC</h1>
          <p className="text-gray-400">
            Select one component per category to configure your perfect machine.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* ── LEFT: COMPONENT SECTIONS ───────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="bg-[#111827] rounded-xl p-6 animate-pulse">
                  <div className="h-5 w-32 bg-gray-700 rounded mb-4" />
                  <div className="space-y-3">
                    <div className="h-16 bg-gray-800 rounded-lg" />
                    <div className="h-16 bg-gray-800 rounded-lg" />
                  </div>
                </div>
              ))
            ) : (
              CATEGORIES.map(({ key, label, icon: Icon, color }) => {
                const items = productsByCategory[key] || []
                const preview = items.slice(0, 2)
                const extraCount = items.length - 2

                return (
                  <div
                    key={key}
                    className="bg-[#111827] rounded-xl overflow-hidden border border-gray-800"
                  >
                    {/* Category header */}
                    <div
                      className="flex items-center justify-between px-6 py-4 border-b border-gray-800"
                      style={{
                        borderLeftWidth: 3,
                        borderLeftColor: color,
                        borderLeftStyle: "solid"
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${color}20` }}
                        >
                          <Icon className="w-4 h-4" style={{ color }} />
                        </div>
                        <h2 className="font-semibold">{label}</h2>
                        {selected[key] && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-[#22c55e]/10 text-[#22c55e] font-medium">
                            Selected
                          </span>
                        )}
                      </div>

                      {items.length > 2 && (
                        <Link
                          to={`/products/${categoryToSlug(key)}`}
                          className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#22c55e] transition"
                        >
                          View all {items.length}
                          <ChevronRight className="w-3 h-3" />
                        </Link>
                      )}
                    </div>

                    {/* Product rows — only first 2 */}
                    <div className="divide-y divide-gray-800/60">
                      {preview.length === 0 ? (
                        <p className="px-6 py-4 text-sm text-gray-500">
                          No {label} products available yet.
                        </p>
                      ) : (
                        preview.map(item => {
                          const isSelected = selected[key]?._id === item._id
                          return (
                            <div
                              key={item._id}
                              onClick={() => handleSelect(key, item)}
                              className={`flex items-center gap-4 px-6 py-4 cursor-pointer transition-all ${
                                isSelected
                                  ? "bg-[#22c55e]/5"
                                  : "hover:bg-gray-800/40"
                              }`}
                            >
                              {/* Thumbnail */}
                              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-800 shrink-0">
                                <img
                                  src={item.image || "https://via.placeholder.com/48?text=?"}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>

                              {/* Name + stock */}
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">{item.name}</p>
                                <p className="text-xs mt-0.5">
                                  {item.stock > 0 ? (
                                    <span className="text-gray-400">{item.stock} in stock</span>
                                  ) : (
                                    <span className="text-red-400">Out of stock</span>
                                  )}
                                </p>
                              </div>

                              {/* Price */}
                              <span className="text-[#22c55e] font-semibold text-sm shrink-0">
                                ₹{item.price.toLocaleString("en-IN")}
                              </span>

                              {/* Radio circle */}
                              <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                                  isSelected
                                    ? "border-[#22c55e] bg-[#22c55e]"
                                    : "border-gray-600"
                                }`}
                              >
                                {isSelected && <Check className="w-3 h-3 text-black" />}
                              </div>
                            </div>
                          )
                        })
                      )}
                    </div>

                    {/* "View More" footer — only shown if there are more than 2 */}
                    {extraCount > 0 && (
                      <Link
                        to={`/products/${categoryToSlug(key)}`}
                        className="flex items-center justify-center gap-2 py-3 text-sm text-gray-400
                                   hover:text-[#22c55e] hover:bg-gray-800/30 transition border-t border-gray-800"
                      >
                        View {extraCount} more {label} option{extraCount > 1 ? "s" : ""}
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                )
              })
            )}
          </div>

          {/* ── RIGHT: BUILD SUMMARY ────────────────────────────────────────── */}
          <div className="lg:col-span-1">
            <div className="bg-[#111827] rounded-xl border border-gray-800 sticky top-24">

              {/* Header + progress */}
              <div className="px-6 py-5 border-b border-gray-800">
                <h2 className="font-semibold">Your Build</h2>
                <p className="text-xs text-gray-400 mt-1">
                  {selectedCount} of {CATEGORIES.length} components selected
                </p>
                <div className="mt-3 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#22c55e] rounded-full transition-all duration-500"
                    style={{ width: `${(selectedCount / CATEGORIES.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Component list */}
              <div className="px-6 py-4 space-y-4">
                {CATEGORIES.map(({ key, label, icon: Icon, color }) => {
                  const item = selected[key]
                  return (
                    <div key={key} className="flex items-start gap-3">
                      <div
                        className="w-6 h-6 rounded flex items-center justify-center shrink-0 mt-0.5"
                        style={{ backgroundColor: `${color}20` }}
                      >
                        <Icon className="w-3 h-3" style={{ color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500">{label}</p>
                        {item ? (
                          <p className="text-xs font-medium text-white truncate">{item.name}</p>
                        ) : (
                          <p className="text-xs text-gray-700">Not selected</p>
                        )}
                      </div>
                      {item && (
                        <span className="text-xs text-[#22c55e] font-semibold shrink-0">
                          ₹{item.price.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Total + actions */}
              <div className="px-6 py-5 border-t border-gray-800 space-y-3">
                <div className="flex justify-between font-bold text-base mb-1">
                  <span>Total</span>
                  <span className="text-[#22c55e]">₹{total.toLocaleString("en-IN")}</span>
                </div>

                {/* Save Build button */}
                <button
                  onClick={handleSaveBuild}
                  disabled={selectedCount === 0 || saving}
                  className={`w-full py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 border transition ${
                    saveSuccess
                      ? "border-[#22c55e] text-[#22c55e] bg-[#22c55e]/10"
                      : selectedCount > 0
                      ? "border-[#22c55e] text-[#22c55e] hover:bg-[#22c55e]/10"
                      : "border-gray-700 text-gray-600 cursor-not-allowed"
                  }`}
                >
                  {saveSuccess ? (
                    <><Check className="w-4 h-4" /> Build Saved!</>
                  ) : saving ? (
                    "Saving..."
                  ) : (
                    <><Save className="w-4 h-4" /> Save Build</>
                  )}
                </button>

                {/* Add to Cart button */}
                <button
                  onClick={handleAddAll}
                  disabled={selectedCount === 0}
                  className={`w-full py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition ${
                    selectedCount > 0
                      ? "bg-[#22c55e] text-black hover:bg-[#16a34a]"
                      : "bg-gray-800 text-gray-600 cursor-not-allowed"
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add Build to Cart
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}