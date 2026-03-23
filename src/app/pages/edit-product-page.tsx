import { AdminLayout } from "../layouts/adminLayout"
import { useParams, useNavigate } from "react-router"
import { useEffect, useState } from "react"
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export function EditProductPage(){

  const {id} = useParams()
  const navigate = useNavigate()

  const [product,setProduct] = useState<any>(null)

  useEffect(()=>{

    const fetchProduct = async()=>{

      const res = await fetch(`${API}/products/${id}`)
      const data = await res.json()

      setProduct(data.product)

    }

    fetchProduct()

  },[])

  const updateProduct = async(e:any)=>{

    e.preventDefault()

    await fetch(`${API}/admin/products/${id}`,{
      method:"PUT",
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify(product)
    })

    navigate("/admin/products")

  }

  if(!product) return null

  return(

    <AdminLayout>

      <h1 className="text-2xl text-white font-bold mb-6">
        Edit Product
      </h1>

      <form
        onSubmit={updateProduct}
        className="bg-[#111827] p-6 rounded-xl border border-white/10 space-y-4 max-w-xl"
      >

        <input
          className="w-full bg-[#1e293b] p-3 rounded text-white"
          value={product.name}
          onChange={e=>setProduct({...product,name:e.target.value})}
        />

        <input
          className="w-full bg-[#1e293b] p-3 rounded text-white"
          value={product.price}
          onChange={e=>setProduct({...product,price:e.target.value})}
        />

        <input
          className="w-full bg-[#1e293b] p-3 rounded text-white"
          value={product.stock}
          onChange={e=>setProduct({...product,stock:e.target.value})}
        />

        <button className="bg-[#22c55e] text-black px-6 py-2 rounded-lg font-semibold">
          Update Product
        </button>

      </form>

    </AdminLayout>

  )

}