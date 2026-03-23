import { AdminLayout } from "../layouts/adminLayout"
import { useEffect, useState } from "react"
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export function AdminOrdersPage(){

  const [orders,setOrders] = useState<any[]>([])

  useEffect(()=>{

    const fetchOrders = async()=>{

      const res = await fetch(`${API}/admin/orders`)

      if(!res.ok){
        console.error("Failed to fetch orders")
        return
      }
      const data = await res.json()
      setOrders(data.orders)

    }

    fetchOrders()

  },[])

  return(

    <AdminLayout>

      <h1 className="text-2xl text-white font-bold mb-6">
        Orders
      </h1>

      <div className="bg-[#111827] rounded-xl border border-white/10 overflow-hidden">

        <table className="w-full text-gray-300">

          <thead className="bg-[#1e293b]">

            <tr>
              <th className="p-4 text-left">Order ID</th>
              <th className="p-4 text-left">Customer</th>
              <th className="p-4 text-left">Total</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Date</th>
            </tr>

          </thead>

          <tbody>

            {orders.map(order=>(
              
              <tr key={order._id} className="border-t border-white/10">

                <td className="p-4">
                  {order._id.slice(-6)}
                </td>

                <td className="p-4">
                  {order.user?.name}
                </td>

                <td className="p-4">
                  ${order.totalAmount}
                </td>

                <td className="p-4">

                  <span className="px-3 py-1 rounded bg-yellow-500/20 text-yellow-400">

                    {order.status}

                  </span>

                </td>

                <td className="p-4">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </AdminLayout>

  )

}