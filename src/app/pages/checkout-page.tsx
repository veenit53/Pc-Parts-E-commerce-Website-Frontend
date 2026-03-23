import { useState } from "react"
import { useNavigate } from "react-router"
import { Navigation } from "../components/navigation"
import { Footer } from "../components/footer"
import { useCart } from "../../context/cart-context"
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

type CartItem = {
  product: {
    _id: string
    name: string
    price: number
    image: string
  }
  quantity: number
}

export function CheckoutPage(){

  const navigate = useNavigate()

  const { cart } = useCart() as { cart: CartItem[] }

  const [address,setAddress] = useState("")
  const [city,setCity] = useState("")
  const [postalCode,setPostalCode] = useState("")
  const [country,setCountry] = useState("India")

  const [paymentMethod,setPaymentMethod] = useState("")
  const [loading,setLoading] = useState(false)

  // CALCULATIONS
  const subtotal = cart.reduce(
    (acc:number,item:CartItem)=> acc + item.product.price * item.quantity,
    0
  )

  const tax = subtotal * 0.08
  const shipping = subtotal > 1000 ? 0 : 99
  const total = subtotal + tax + shipping


  const placeOrder = async()=>{

    const token = localStorage.getItem("token")

    if(!token){
      alert("Please login first")
      return
    }

    if(cart.length === 0){
      alert("Cart is empty")
      return
    }

    if(!address || !city || !postalCode){
      alert("Please fill all shipping details")
      return
    }

    if(!paymentMethod){
      alert("Please select a payment method")
      return
    }

    try{

      setLoading(true)

      const res = await fetch(`${API}/orders`,{

        method:"POST",

        headers:{
          "Content-Type":"application/json",
          Authorization:`Bearer ${token}`
        },

        body:JSON.stringify({

          shippingAddress:{
            address,
            city,
            postalCode,
            country
          },

          paymentMethod,

        })

      })

      const data = await res.json()

      if(!res.ok){
        alert(data.message || "Order failed")
        setLoading(false)
        return
      }

      // redirect to success page
      navigate(`/order-success/${data.order._id}`)

    }
    catch(err){

      console.error("Order error",err)
      alert("Something went wrong")

    }
    finally{
      setLoading(false)
    }

  }


  return(

<div className="min-h-screen bg-[#0f172a] text-white">

<Navigation/>

<div className="max-w-7xl mx-auto px-6 py-10">

<h1 className="text-3xl font-bold mb-8">
Checkout
</h1>

<div className="grid lg:grid-cols-2 gap-10">

{/* LEFT SIDE */}
<div className="space-y-6">

{/* SHIPPING */}
<div className="bg-[#111827] p-6 rounded-xl border border-gray-800">

<h2 className="text-lg font-semibold mb-6">
Shipping Details
</h2>

<div className="space-y-4">

<input
value={address}
onChange={(e)=>setAddress(e.target.value)}
placeholder="Address"
className="w-full bg-[#0f172a] border border-gray-700 p-3 rounded"
/>

<input
value={city}
onChange={(e)=>setCity(e.target.value)}
placeholder="City"
className="w-full bg-[#0f172a] border border-gray-700 p-3 rounded"
/>

<input
value={postalCode}
onChange={(e)=>setPostalCode(e.target.value)}
placeholder="Postal Code"
className="w-full bg-[#0f172a] border border-gray-700 p-3 rounded"
/>

<input
value={country}
onChange={(e)=>setCountry(e.target.value)}
placeholder="Country"
className="w-full bg-[#0f172a] border border-gray-700 p-3 rounded"
/>

</div>

</div>


{/* PAYMENT METHOD */}
<div className="bg-[#111827] p-6 rounded-xl border border-gray-800">

<h2 className="text-lg font-semibold mb-4">
Payment Method
</h2>

<div className="space-y-3">

<label className="flex items-center gap-3 border border-gray-700 p-3 rounded cursor-pointer">
<input
type="radio"
value="COD"
checked={paymentMethod === "COD"}
onChange={(e)=>setPaymentMethod(e.target.value)}
/>
Cash on Delivery
</label>

<label className="flex items-center gap-3 border border-gray-700 p-3 rounded cursor-pointer">
<input
type="radio"
value="UPI"
checked={paymentMethod === "UPI"}
onChange={(e)=>setPaymentMethod(e.target.value)}
/>
UPI
</label>

<label className="flex items-center gap-3 border border-gray-700 p-3 rounded cursor-pointer">
<input
type="radio"
value="CARD"
checked={paymentMethod === "CARD"}
onChange={(e)=>setPaymentMethod(e.target.value)}
/>
Credit / Debit Card
</label>

</div>

</div>

</div>


{/* RIGHT SIDE */}
<div className="bg-[#111827] p-6 rounded-xl border border-gray-800 h-fit">

<h2 className="text-lg font-semibold mb-6">
Order Summary
</h2>

<div className="space-y-4 max-h-64 overflow-y-auto">

{cart.map((item:CartItem)=>(

<div key={item.product._id} className="flex justify-between text-sm">

<span>
{item.product.name} × {item.quantity}
</span>

<span className="text-[#22c55e]">
₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
</span>

</div>

))}

</div>


<div className="border-t border-gray-800 mt-6 pt-4 space-y-2">

<div className="flex justify-between text-sm">
<span>Subtotal</span>
<span>₹{subtotal.toLocaleString("en-IN")}</span>
</div>

<div className="flex justify-between text-sm">
<span>Tax</span>
<span>₹{tax.toLocaleString("en-IN")}</span>
</div>

<div className="flex justify-between text-sm">
<span>Shipping</span>
{shipping === 0
? <span className="text-[#22c55e]">FREE</span>
: <span>₹{shipping}</span>}
</div>

<div className="flex justify-between font-semibold text-lg mt-2">
<span>Total</span>
<span className="text-[#22c55e]">
₹{total.toLocaleString("en-IN")}
</span>
</div>

</div>


<button
onClick={placeOrder}
disabled={loading}
className={`w-full mt-6 py-3 rounded-lg font-semibold transition
${loading
  ? "bg-gray-600 cursor-not-allowed"
  : "bg-[#22c55e] text-black hover:bg-[#16a34a]"
}`}
>

{loading ? "Placing Order..." : "Place Order"}

</button>

</div>

</div>

</div>

<Footer/>

</div>

)
}