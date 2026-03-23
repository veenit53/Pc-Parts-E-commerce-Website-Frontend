import { Search, ShoppingCart, User, Menu, ChevronDown, MonitorSpeaker, Cpu, X } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router"
import { useCart } from "../../context/cart-context"

const CATEGORIES = [
  { label: "CPU",           slug: "cpu"           },
  { label: "GPU",           slug: "gpu"           },
  { label: "Motherboard",   slug: "motherboard"   },
  { label: "RAM",           slug: "ram"           },
  { label: "Storage",       slug: "storage"       },
  { label: "Power Supply",  slug: "power-supply"  },
  { label: "Cabinet",       slug: "cabinet"       },
]

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen]   = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOpen, setSearchOpen]   = useState(false)

  const { totalItems } = useCart()
  const navigate       = useNavigate()
  const searchRef      = useRef<HTMLInputElement>(null)

  const token     = localStorage.getItem("token")
  const isLoggedIn = !!token

  // Focus input when search bar opens on mobile
  useEffect(() => {
    if (searchOpen) searchRef.current?.focus()
  }, [searchOpen])

  const handleProfileClick = () => navigate(isLoggedIn ? "/profile" : "/login")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = searchQuery.trim()
    if (!q) return
    navigate(`/products?search=${encodeURIComponent(q)}`)
    setSearchQuery("")
    setSearchOpen(false)
    setIsMenuOpen(false)
  }

  const handleCategoryClick = (slug: string) => {
    navigate(`/products/${slug}`)
    setIsMenuOpen(false)
  }


  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0f172a]/95 backdrop-blur-md">
      <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">

          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2 cursor-pointer shrink-0"
          >
            <MonitorSpeaker className="h-7 w-7 text-[#22c55e]" />
            <span className="text-lg font-bold text-white hidden sm:block">PC Builder Store</span>
          </div>

          <div className="hidden md:flex md:flex-1 md:items-center md:justify-center md:gap-6">

            <div className="group relative">
              <button className="flex items-center gap-1 text-sm text-gray-300 transition-colors hover:text-[#22c55e] py-2">
                Categories
                <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
              </button>

              <div className="invisible absolute left-0 top-full mt-1 w-52 rounded-xl border border-white/10 bg-[#111827] opacity-0 shadow-2xl transition-all duration-150 group-hover:visible group-hover:opacity-100">
                <div className="p-1.5">
                  {CATEGORIES.map(({ label, slug }) => (
                    <button
                      key={slug}
                      onClick={() => handleCategoryClick(slug)}
                      className="w-full rounded-lg px-4 py-2 text-left text-sm text-gray-300 transition-colors hover:bg-[#1e293b] hover:text-[#22c55e]"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate("/products")}
              className="text-sm text-gray-300 hover:text-[#22c55e] transition-colors"
            >
              All Products
            </button>

            <button
              onClick={() => navigate("/pc-builder")}
              className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-[#22c55e] transition-colors"
            >
              <Cpu className="h-4 w-4" />
              Build a PC
            </button>

            <form onSubmit={handleSearch} className="relative w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search components..."
                className="w-full h-9 rounded-full bg-[#1e293b] border border-white/10 pl-9 pr-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#22c55e] transition-colors"
              />
            </form>
          </div>

          <div className="flex items-center gap-3 shrink-0">

            <button
              onClick={() => setSearchOpen(v => !v)}
              className="md:hidden text-gray-300 hover:text-[#22c55e] transition-colors"
            >
              {searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </button>

            <button
              onClick={() => navigate("/cart")}
              className="relative text-gray-300 hover:text-[#22c55e] transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#22c55e] text-xs font-bold text-black">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </button>

            <button
              onClick={handleProfileClick}
              className="text-gray-300 hover:text-[#22c55e] transition-colors"
            >
              <User className="h-6 w-6" />
            </button>

            <button
              className="md:hidden text-gray-300 hover:text-[#22c55e] transition-colors"
              onClick={() => setIsMenuOpen(v => !v)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="pb-3 md:hidden">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                ref={searchRef}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search components..."
                className="w-full h-10 rounded-full bg-[#1e293b] border border-white/10 pl-9 pr-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#22c55e] transition-colors"
              />
            </form>
          </div>
        )}

        {isMenuOpen && (
          <div className="border-t border-white/10 py-4 md:hidden">

            <div className="space-y-1 mb-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 px-4 mb-2">
                Categories
              </p>
              {CATEGORIES.map(({ label, slug }) => (
                <button
                  key={slug}
                  onClick={() => handleCategoryClick(slug)}
                  className="block w-full rounded-lg px-4 py-2.5 text-left text-sm text-gray-300 hover:bg-[#1e293b] hover:text-[#22c55e] transition-colors"
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="border-t border-white/10 pt-4 space-y-1">
              <button
                onClick={() => { navigate("/products"); setIsMenuOpen(false) }}
                className="block w-full rounded-lg px-4 py-2.5 text-left text-sm text-gray-300 hover:bg-[#1e293b] hover:text-[#22c55e] transition-colors"
              >
                All Products
              </button>
              <button
                onClick={() => { navigate("/pc-builder"); setIsMenuOpen(false) }}
                className="flex items-center gap-2 w-full rounded-lg px-4 py-2.5 text-left text-sm text-gray-300 hover:bg-[#1e293b] hover:text-[#22c55e] transition-colors"
              >
                <Cpu className="h-4 w-4" />
                Build a PC
              </button>
            </div>

          </div>
        )}
      </div>
    </nav>
  )
}