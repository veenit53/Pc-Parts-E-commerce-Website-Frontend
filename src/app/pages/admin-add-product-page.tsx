import { AdminLayout } from "../layouts/adminLayout"
import { useState } from "react"
import { useNavigate } from "react-router"

export function AddProductPage(){

  const navigate = useNavigate()

  const [name,setName] = useState("")
  const [price,setPrice] = useState("")
  const [stock,setStock] = useState("")
  const [image,setImage] = useState("")
  const [description,setDescription] = useState("")
  const [category,setCategory] = useState("")

  const handleSubmit = async(e:any)=>{

    e.preventDefault()

    const product = {
      name,
      category,
      price,
      stock,
      image,
      description
    }

    await fetch("http://localhost:5000/admin/products",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify(product)
    })

    navigate("/admin/products")

  }

  return(

    <AdminLayout>

      <h1 className="text-2xl text-white font-bold mb-6">
        Add Product
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-[#111827] p-6 rounded-xl border border-white/10 space-y-4 max-w-xl"
      >

        <input
            placeholder="Product Name"
            className="w-full bg-[#1e293b] p-3 rounded text-white"
            value={name}
            onChange={e=>setName(e.target.value)}
        />

        <select
            value={category}
            onChange={(e)=>setCategory(e.target.value)}
            className="w-full bg-[#1e293b] p-3 rounded text-white"
            >

            <option value="">Select Category</option>
            <option value="CPU">CPU</option>
            <option value="GPU">GPU</option>
            <option value="Motherboard">Motherboard</option>
            <option value="RAM">RAM</option>
            <option value="Storage">Storage</option>
            <option value="Power Supply">Power Supply</option>
            <option value="Cabinet">Cabinet</option>
        </select>

        <input
            placeholder="Price"
            className="w-full bg-[#1e293b] p-3 rounded text-white"
            value={price}
            onChange={e=>setPrice(e.target.value)}
        />

        <input
            placeholder="Stock"
            className="w-full bg-[#1e293b] p-3 rounded text-white"
            value={stock}
            onChange={e=>setStock(e.target.value)}
        />

        <input
            placeholder="Image URL"
            className="w-full bg-[#1e293b] p-3 rounded text-white"
            value={image}
            onChange={e=>setImage(e.target.value)}
        />

        <textarea
            placeholder="Description"
            className="w-full bg-[#1e293b] p-3 rounded text-white"
            value={description}
            onChange={e=>setDescription(e.target.value)}
        />

        <button className="bg-[#22c55e] text-black px-6 py-2 rounded-lg font-semibold">
            Save Product
        </button>

      </form>

    </AdminLayout>

  )

}