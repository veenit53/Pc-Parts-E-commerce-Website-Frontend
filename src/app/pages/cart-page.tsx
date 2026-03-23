import { Link, useNavigate } from "react-router"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react"
import { Navigation } from "../components/navigation"
import { useCart } from "../../context/cart-context"

export function CartPage() {

  const navigate = useNavigate()

  // ✅ USE CONTEXT ONLY
  const { cart, removeFromCart, updateQuantity } = useCart()

  // ✅ CALCULATIONS
  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  const tax = subtotal * 0.08
  const shipping = subtotal > 1000 ? 0 : 99
  const total = subtotal + tax + shipping

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">

      <Navigation />

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* TOP */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/products">
            <button className="flex items-center gap-2 text-gray-300 hover:text-[#22c55e]">
              <ArrowLeft size={18}/>
              Continue Shopping
            </button>
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-8">
          Shopping Cart
        </h1>

        {/* EMPTY */}
        {cart.length === 0 ? (

          <div className="bg-[#111827] border border-gray-800 rounded-xl p-16 text-center">

            <ShoppingBag className="mx-auto mb-4 text-gray-500" size={60}/>

            <h2 className="text-2xl font-semibold mb-2">
              Your cart is empty
            </h2>

            <p className="text-gray-400 mb-6">
              Add some products to start building your PC
            </p>

            <Link to="/products">
              <button className="bg-[#22c55e] text-black px-6 py-3 rounded-lg font-semibold">
                Browse Products
              </button>
            </Link>

          </div>

        ) : (

          <div className="grid lg:grid-cols-3 gap-8">

            {/* CART ITEMS */}
            <div className="lg:col-span-2 space-y-4">

              {cart.map(item => (

                <div
                  key={item.product._id}
                  className="bg-[#111827] border border-gray-800 rounded-xl p-6 flex gap-6 items-center"
                >

                  <img
                    src={item.product.image || "https://via.placeholder.com/200"}
                    className="w-28 h-28 rounded-lg object-cover"
                  />

                  <div className="flex-1">

                    <p className="text-xs text-gray-400 mb-1">
                      {item.product.category}
                    </p>

                    <h3 className="font-semibold text-lg">
                      {item.product.name}
                    </h3>

                    <div className="flex items-center justify-between mt-4">

                      {/* QUANTITY */}
                      <div className="flex items-center border border-gray-700 rounded-lg">

                        <button
                          onClick={() =>
                            updateQuantity(item.product._id, item.quantity - 1)
                          }
                          className="px-3 py-1"
                        >
                          <Minus size={16}/>
                        </button>

                        <span className="px-4">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            updateQuantity(item.product._id, item.quantity + 1)
                          }
                          className="px-3 py-1"
                        >
                          <Plus size={16}/>
                        </button>

                      </div>

                      {/* PRICE */}
                      <div className="text-right">

                        <p className="text-xl font-bold text-[#22c55e]">
                          ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                        </p>

                        {item.quantity > 1 && (
                          <p className="text-xs text-gray-400">
                            ₹{item.product.price.toLocaleString("en-IN")} each
                          </p>
                        )}

                      </div>

                    </div>

                  </div>

                  {/* REMOVE */}
                  <button
                    onClick={() => removeFromCart(item.product._id)}
                    className="text-red-400 hover:text-red-500"
                  >
                    <Trash2/>
                  </button>

                </div>

              ))}

            </div>

            {/* ORDER SUMMARY */}
            <div>

              <div className="bg-[#111827] border border-gray-800 rounded-xl p-6 sticky top-24">

                <h2 className="text-xl font-semibold mb-6">
                  Order Summary
                </h2>

                <div className="flex justify-between mb-3">
                  <span className="text-gray-400">Subtotal</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex justify-between mb-3">
                  <span className="text-gray-400">Tax</span>
                  <span>₹{tax.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex justify-between mb-3">
                  <span className="text-gray-400">Shipping</span>

                  {shipping === 0
                    ? <span className="text-[#22c55e]">FREE</span>
                    : <span>₹{shipping}</span>}
                </div>

                <hr className="my-4 border-gray-700"/>

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-[#22c55e]">
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>

                <button 
                  onClick={() => navigate("/checkout")}
                  className="mt-6 w-full bg-[#22c55e] text-black py-3 rounded-lg font-semibold hover:bg-[#16a34a] transition"
                >
                  Proceed to Checkout
                </button>

                <p className="text-xs text-gray-400 mt-4">
                  ✓ Secure checkout  
                  ✓ 30-day return policy  
                  ✓ Free shipping over ₹1000
                </p>

              </div>

            </div>

          </div>

        )}

      </div>

    </div>
  )
}