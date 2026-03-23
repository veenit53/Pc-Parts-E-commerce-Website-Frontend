import { useEffect, useState } from "react"
import { Link } from "react-router"
import { Package, Eye } from "lucide-react"
import { Navigation } from "../components/navigation"
import { Footer } from "../components/footer"

type OrderItem = {
  name: string
  price: number
  quantity: number
}

type Order = {
  subtotal: number
  tax: number
  shipping: number
  _id: string
  createdAt: string
  status: string
  totalAmount: number
  items: OrderItem[]
}

export function OrdersPage() {

  const [orders,setOrders] = useState<Order[]>([])
  const [loading,setLoading] = useState(true)

  useEffect(()=>{

    const fetchOrders = async()=>{

      try{

        const token = localStorage.getItem("token")

        const res = await fetch("http://localhost:5000/my-orders",{
          headers:{
            Authorization:`Bearer ${token}`
          }
        })

        const data = await res.json()

        if(res.ok){
          setOrders(data.orders || [])
        }

      }
      catch(err){
        console.error("Failed to fetch orders",err)
      }
      finally{
        setLoading(false)
      }

    }

    fetchOrders()

  },[])


  // STATUS STYLE (NO BADGE)
  const getStatusStyle = (status:string)=>{

    const map:any = {
      Delivered:"bg-green-500/20 text-green-400",
      Shipped:"bg-blue-500/20 text-blue-400",
      Processing:"bg-yellow-500/20 text-yellow-400",
      Pending:"bg-yellow-500/20 text-yellow-400",
      Cancelled:"bg-red-500/20 text-red-400"
    }

    return map[status] || "bg-gray-500/20 text-gray-400"
  }


  if(loading){
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white">
        Loading orders...
      </div>
    )
  }


  return (

<div className="min-h-screen bg-[#0f172a] text-white">

<Navigation/>

<div className="max-w-7xl mx-auto px-6 py-10">

<h1 className="text-3xl font-bold mb-2">
Your Orders
</h1>

<p className="text-gray-400 mb-8">
Track and manage your orders
</p>


{orders.length === 0 ? (

<div className="bg-[#111827] border border-gray-800 rounded-xl p-12 text-center">

<Package className="mx-auto mb-4 text-gray-500" size={60}/>

<h2 className="text-2xl font-semibold mb-2">
No orders yet
</h2>

<p className="text-gray-400 mb-6">
Start shopping to see your orders here
</p>

<Link to="/products">
<button className="bg-[#22c55e] text-black px-6 py-3 rounded-lg font-semibold">
Browse Products
</button>
</Link>

</div>

) : (

<div className="space-y-6">

{orders.map(order => (

<div
key={order._id}
className="bg-[#111827] border border-gray-800 rounded-xl p-6"
>

<div className="flex justify-between items-center mb-4">

<div>

<h3 className="text-lg font-semibold">
Order #{order._id.slice(-6)}
</h3>

<p className="text-sm text-gray-400">
{new Date(order.createdAt).toLocaleDateString()}
</p>

</div>

{/* STATUS (NO BADGE) */}
<span className={`px-3 py-1 text-xs rounded-full ${getStatusStyle(order.status)}`}>
{order.status}
</span>

</div>


{/* ITEMS */}
<div className="space-y-3 mb-4">

{order.items.map((item,index)=>(

<div
key={index}
className="flex justify-between text-sm bg-[#0f172a] p-3 rounded"
>

<span>
{item.name} × {item.quantity}
</span>

<span className="text-[#22c55e]">
₹{(item.price * item.quantity).toLocaleString("en-IN")}
</span>

</div>

))}

</div>


{/* TOTAL */}
<div className="flex flex-col gap-1 border-t border-gray-800 pt-4">

<div className="flex justify-between text-sm text-gray-400">
<span>Subtotal</span>
<span>
₹{(order.subtotal ?? order.totalAmount).toLocaleString("en-IN")}
</span>
</div>

<div className="flex justify-between text-sm text-gray-400">
<span>Tax</span>
<span>
₹{(order.tax ?? 0).toLocaleString("en-IN")}
</span>
</div>

<div className="flex justify-between text-sm text-gray-400">
<span>Shipping</span>
<span>
{order.shipping === 0 || order.shipping === undefined
? "Free"
: `₹${order.shipping}`}
</span>
</div>

<div className="flex justify-between font-semibold mt-2">

<span>Total</span>

<span className="text-[#22c55e] font-bold">
₹{order.totalAmount.toLocaleString("en-IN")}
</span>

</div>

</div>


{/* ACTION */}
<div className="mt-4">

<Link to={`/orders/${order._id}`}>
<button className="flex items-center gap-2 text-sm border border-gray-700 px-4 py-2 rounded hover:bg-gray-800">
<Eye size={16}/>
View Details
</button>
</Link>

</div>

</div>

))}

</div>

)}

</div>

<Footer/>

</div>

  )

}