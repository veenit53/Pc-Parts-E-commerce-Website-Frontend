import { createContext, useContext, useEffect, useState } from 'react'
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const CartContext = createContext<any>(null)

export const CartProvider = ({ children }: any) => {
  const [cart, setCart] = useState<any[]>([])

  const token = localStorage.getItem('token')

  const fetchCart = async () => {
    if (!token) return

    const res = await fetch(`${API}/cart`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    const data = await res.json()

    setCart(data.items || [])
  }

  useEffect(() => {
    fetchCart()
  }, [])

  // const addToCart = async (productId: string) => {
  //   await fetch('http://localhost:5000/cart/add', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${token}`
  //     },
  //     body: JSON.stringify({ productId })
  //   })

  //   fetchCart()
  // }

  const addToCart = async (productId: string) => {
    try {
      await fetch(`${API}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId })
      })

      fetchCart()
    } catch (err) {
      console.error('Add failed', err)
    }
  }

  const removeFromCart = async (productId: string) => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`${API}/cart/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    console.log("DELETE RESPONSE:", data);

    if(data.items||[]) {
      setCart(data.items);
    }
    else{
      fetchCart();
    }

  } catch (err) {
    console.error("Remove failed", err);
  }
};

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      await fetch(`${API}/cart/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId, quantity })
      })

      fetchCart()
    } catch (err) {
      console.error('Update failed', err)
    }
  }

  const getQuantity = (productId: string) => {
    const item = cart.find(i => i.product._id === productId)

    return item ? item.quantity : 0
  }

  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        getQuantity,
        totalItems
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
