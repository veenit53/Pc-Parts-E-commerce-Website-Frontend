import { useEffect, useState } from "react"
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export function ProfilePage() {

  const [user, setUser] = useState<any>(null)

  useEffect(() => {

    const fetchProfile = async () => {

      try {

        const token = localStorage.getItem("token")

        const response = await fetch(`${API}/api/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        const data = await response.json()

        if(response.ok){
          setUser(data.user)
        }

      } catch (error) {
        console.error("Profile fetch error:", error)
      }

    }

    fetchProfile()

  }, [])

  if(!user){
    return <div className="text-white p-10">Loading...</div>
  }

  return (

    <div className="min-h-screen bg-[#0f172a] text-white p-10">

      <h1 className="text-3xl font-bold mb-6">
        My Profile
      </h1>

      <div className="bg-[#111827] p-6 rounded-xl w-[400px]">

        <p className="mb-2">
          <strong>Name:</strong> {user.name}
        </p>

        <p className="mb-2">
          <strong>Email:</strong> {user.email}
        </p>

        <p className="mb-2">
          <strong>Role:</strong> {user.role}
        </p>

      </div>

      <div>
        <button
          onClick={() => {
            localStorage.removeItem("token")
            window.location.href = "/login"
          }}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>

    </div>

  )
}