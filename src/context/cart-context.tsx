import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext<any>(null)

export const CartProvider = ({ children }: any) => {
  const [cart, setCart] = useState<any[]>([])

  const token = localStorage.getItem('token')

  const fetchCart = async () => {
    if (!token) return

    const res = await fetch('http://localhost:5000/cart', {
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
      await fetch('http://localhost:5000/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId })
      })

      fetchCart() // ✅ ALWAYS SYNC REAL DATA
    } catch (err) {
      console.error('Add failed', err)
    }
  }

  // const removeFromCart = async(productId:string)=>{

  //   await fetch(`http://localhost:5000/cart/${productId}`,{
  //     method:"DELETE",
  //     headers:{
  //       Authorization:`Bearer ${token}`
  //     }
  //   })

  //   fetchCart()

  // }

  const removeFromCart = async (productId: string) => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`http://localhost:5000/cart/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    console.log("DELETE RESPONSE:", data);

    // ✅ directly update state from backend
    if(data.items||[]) {
      setCart(data.items);
    }
    else{
      // fallback to refetch if backend doesn't return updated cart
      fetchCart();
    }

  } catch (err) {
    console.error("Remove failed", err);
  }
};

  // const updateQuantity = async (productId: string, quantity: number) => {
  //   await fetch('http://localhost:5000/cart/update', {
  //     method: 'PUT',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${token}`
  //     },
  //     body: JSON.stringify({ productId, quantity })
  //   })

  //   fetchCart()
  // }

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      await fetch('http://localhost:5000/cart/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId, quantity })
      })

      fetchCart() // ✅ sync
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
