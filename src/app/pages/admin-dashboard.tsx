import { StatsCard } from "../components/ui/statsCard"
import { AdminLayout } from "../layouts/adminLayout"

export function AdminDashboard() {

  return (

    <AdminLayout>

      <h1 className="text-2xl text-white font-bold mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-4 gap-6">

        <StatsCard title="Total Revenue" value="$52,400"/>
        <StatsCard title="Total Orders" value="1,240"/>
        <StatsCard title="Products" value="320"/>
        <StatsCard title="Users" value="890"/>

      </div>

      <div className="mt-10 grid grid-cols-2 gap-6">

        <div className="bg-[#111827] p-6 rounded-xl border border-white/10">
          <h2 className="text-white font-semibold mb-4">
            Recent Orders
          </h2>

          <p className="text-gray-400">
            Order data will appear here.
          </p>
        </div>

        <div className="bg-[#111827] p-6 rounded-xl border border-white/10">
          <h2 className="text-white font-semibold mb-4">
            Low Stock Products
          </h2>

          <p className="text-gray-400">
            Products running out of stock will appear here.
          </p>
        </div>

      </div>

    </AdminLayout>

  )

}