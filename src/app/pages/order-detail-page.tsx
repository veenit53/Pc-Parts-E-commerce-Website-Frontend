import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router"
import { Navigation } from "../components/navigation"
import { Footer } from "../components/footer"
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

type OrderItem = {
  name: string
  price: number
  quantity: number
  image?: string
}

type Order = {
  subtotal: number
  tax: number
  shipping: number
  _id: string
  createdAt: string
  status: string
  totalAmount: number
  paymentMethod: string
  shippingAddress: {
    address: string
    city: string
    postalCode: string
    country: string
  }
  items: OrderItem[]
}

export function OrderDetailsPage(){

  const { id } = useParams()
  const navigate = useNavigate()

  const [order,setOrder] = useState<Order | null>(null)
  const [loading,setLoading] = useState(true)

  useEffect(()=>{

    const fetchOrder = async()=>{

      try{

        const token = localStorage.getItem("token")

        const res = await fetch(`${API}/orders/${id}`,{
          headers:{
            Authorization:`Bearer ${token}`
          }
        })

        const data = await res.json()

        if(res.ok){
          setOrder(data.order)
        } else {
          console.error(data.message)
        }

      }
      catch(err){
        console.error("Failed to fetch order",err)
      }
      finally{
        setLoading(false)
      }

    }

    if(id) fetchOrder()

  },[id])


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
        Loading order...
      </div>
    )
  }

  if(!order){
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f172a] text-white">
        <p className="mb-4">Order not found</p>
        <button
          onClick={()=>navigate("/orders")}
          className="bg-[#22c55e] text-black px-4 py-2 rounded"
        >
          Back to Orders
        </button>
      </div>
    )
  }


  return (

<div className="min-h-screen bg-[#0f172a] text-white">

<Navigation/>

<div className="max-w-5xl mx-auto px-6 py-10">

{/* HEADER */}
<div className="flex justify-between items-center mb-6">

<h1 className="text-3xl font-bold">
Order Details
</h1>

<button
onClick={()=>navigate("/orders")}
className="text-sm border border-gray-700 px-4 py-2 rounded hover:bg-gray-800"
>
Back
</button>

</div>


{/* ORDER INFO */}
<div className="bg-[#111827] border border-gray-800 rounded-xl p-6 mb-6">

<div className="flex justify-between items-center">

<div>
<p className="text-sm text-gray-400">Order ID</p>
<p className="font-mono text-[#22c55e]">{order._id}</p>
</div>

<span className={`px-3 py-1 text-xs rounded-full ${getStatusStyle(order.status)}`}>
{order.status}
</span>

</div>

<p className="text-sm text-gray-400 mt-3">
Placed on {new Date(order.createdAt).toLocaleDateString()}
</p>

</div>


{/* ITEMS */}
<div className="bg-[#111827] border border-gray-800 rounded-xl p-6 mb-6">

<h2 className="text-lg font-semibold mb-4">Items</h2>

<div className="space-y-4">

{order.items.map((item,index)=>(

<div key={index} className="flex justify-between items-center">

<div className="flex items-center gap-4">

{item.image && (
<img
src={item.image}
className="w-12 h-12 object-cover rounded"
/>
)}

<div>
<p>{item.name}</p>
<p className="text-sm text-gray-400">
Qty: {item.quantity}
</p>
</div>

</div>

<p className="text-[#22c55e] font-semibold">
₹{(item.price * item.quantity).toLocaleString("en-IN")}
</p>

</div>

))}

</div>

</div>


{/* SHIPPING */}
<div className="bg-[#111827] border border-gray-800 rounded-xl p-6 mb-6">

<h2 className="text-lg font-semibold mb-4">Shipping Address</h2>

<p>{order.shippingAddress.address}</p>
<p>{order.shippingAddress.city}</p>
<p>{order.shippingAddress.postalCode}</p>
<p>{order.shippingAddress.country}</p>

</div>


{/* PAYMENT */}
<div className="bg-[#111827] border border-gray-800 rounded-xl p-6 mb-6">

<h2 className="text-lg font-semibold mb-4">Payment Method</h2>

<p>{order.paymentMethod}</p>

</div>


{/* TOTAL */}
<div className="bg-[#111827] border border-gray-800 rounded-xl p-6 space-y-2">

<div className="flex justify-between text-sm">
<span>Subtotal</span>
<span>₹{order.subtotal.toLocaleString("en-IN")}</span>
</div>

<div className="flex justify-between text-sm">
<span>Tax</span>
<span>₹{order.tax.toLocaleString("en-IN")}</span>
</div>

<div className="flex justify-between text-sm">
<span>Shipping</span>
<span>
{order.shipping === 0 ? "Free" : `₹${order.shipping}`}
</span>
</div>

<hr className="border-gray-700"/>

<div className="flex justify-between text-lg font-bold">

<span>Total</span>

<span className="text-[#22c55e]">
₹{order.totalAmount.toLocaleString("en-IN")}
</span>

</div>

</div>

</div>

<Footer/>

</div>

  )

}