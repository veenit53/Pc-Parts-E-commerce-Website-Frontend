import { LayoutDashboard, Package, PlusSquare, ShoppingCart, Users } from "lucide-react"
import { Link } from "react-router"

export function AdminSidebar() {
  return (
    <aside className="w-64 bg-[#111827] border-r border-white/10 min-h-screen text-gray-300">

      <div className="p-6 border-b border-white/10">
        <h1 className="text-xl font-bold text-white">
          PC<span className="text-[#22c55e]">Forge</span> Admin
        </h1>
      </div>

      <nav className="p-4 space-y-2">

        <Link
          to="/admin"
          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#1e293b]"
        >
          <LayoutDashboard size={18}/>
          Dashboard
        </Link>

        <Link
          to="/admin/products"
          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#1e293b]"
        >
          <Package size={18}/>
          Products
        </Link>

        <Link
          to="/admin/products/add"
          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#1e293b]"
        >
          <PlusSquare size={18}/>
          Add Product
        </Link>

        <Link
          to="/admin/orders"
          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#1e293b]"
        >
          <ShoppingCart size={18}/>
          Orders
        </Link>

      </nav>
    </aside>
  )
}