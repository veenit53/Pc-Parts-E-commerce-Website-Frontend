import { AdminLayout } from "../layouts/adminLayout"
import { useEffect, useState } from "react"
import { Pencil, Trash } from "lucide-react"
import { useNavigate } from "react-router"

export function AdminProductsPage() {

  const [products, setProducts] = useState<any[]>([])
  const navigate = useNavigate()

  useEffect(() => {

    const fetchProducts = async () => {

      const res = await fetch("http://localhost:5000/products")
      const data = await res.json()

      setProducts(data.products || [])

    }

    fetchProducts()

  }, [])

  const deleteProduct = async (id:string) => {

    const confirmDelete = confirm("Delete this product?")

    if(!confirmDelete) return

    await fetch(`http://localhost:5000/admin/products/${id}`,{
      method:"DELETE"
    })

    setProducts(products.filter(p => p._id !== id))

  }

  return (

    <AdminLayout>

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-2xl text-white font-bold">
          Products
        </h1>

        <button
          onClick={()=> navigate("/admin/products/add")}
          className="bg-[#22c55e] text-black px-4 py-2 rounded-lg font-semibold"
        >
          Add Product
        </button>

      </div>

      <div className="bg-[#111827] rounded-xl border border-white/10 overflow-hidden">

        <table className="w-full text-gray-300">

          <thead className="bg-[#1e293b]">

            <tr>
              <th className="p-4 text-left">Image</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Stock</th>
              <th className="p-4 text-left">Actions</th>
            </tr>

          </thead>

          <tbody>

            {products.map(product => (

              <tr key={product._id} className="border-t border-white/10">

                <td className="p-4">
                  <img
                    src={product.image}
                    className="w-14 h-14 object-cover rounded"
                  />
                </td>

                <td className="p-4">
                  {product.name}
                </td>

                <td className="p-4">
                  ${product.price}
                </td>

                <td className="p-4">
                  {product.stock}
                </td>

                <td className="p-4 flex gap-3">

                  <button
                    onClick={()=> navigate(`/admin/products/edit/${product._id}`)}
                    className="text-blue-400"
                  >
                    <Pencil size={18}/>
                  </button>

                  <button
                    onClick={()=> deleteProduct(product._id)}
                    className="text-red-400"
                  >
                    <Trash size={18}/>
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </AdminLayout>

  )

}