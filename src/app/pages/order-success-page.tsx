import { useParams, useNavigate } from "react-router"
import { CheckCircle } from "lucide-react"
import { Navigation } from "../components/navigation"
import { Footer } from "../components/footer"

export function OrderSuccessPage(){

  const { id } = useParams()
  const navigate = useNavigate()

  return(

<div className="min-h-screen bg-[#0f172a] text-white">

<Navigation/>

<div className="flex flex-col items-center justify-center px-6 py-20 text-center">

{/* ICON */}
<CheckCircle className="text-[#22c55e] mb-6 animate-bounce" size={70}/>

{/* TITLE */}
<h1 className="text-3xl font-bold mb-3">
Order Placed Successfully 🎉
</h1>

<p className="text-gray-400 mb-6">
Thank you for your purchase!
</p>

{/* ORDER ID */}
<div className="bg-[#111827] border border-gray-800 rounded-xl px-6 py-4 mb-8">

<p className="text-sm text-gray-400">
Order ID
</p>

<p className="font-mono text-[#22c55e] mt-1">
{id}
</p>

</div>

{/* BUTTONS */}
<div className="flex gap-4">

<button
onClick={()=>navigate("/orders")}
className="bg-[#22c55e] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#16a34a] transition"
>
View Orders
</button>

<button
onClick={()=>navigate("/")}
className="border border-gray-700 px-6 py-3 rounded-lg hover:bg-gray-800 transition"
>
Go Home
</button>

</div>

</div>

<Footer/>

</div>

  )
}