import { Search, Bell, User } from "lucide-react"

export function AdminHeader() {

  return (

    <header className="h-16 border-b border-white/10 bg-[#0f172a] flex items-center justify-between px-6">

      <div className="flex items-center gap-3 w-96">

        <Search className="text-gray-400"/>

        <input
          placeholder="Search..."
          className="bg-transparent outline-none text-gray-300 w-full"
        />

      </div>

      <div className="flex items-center gap-6">

        <Bell className="text-gray-300"/>

        <div className="flex items-center gap-2 text-gray-300">
          <User size={20}/>
          Admin
        </div>

      </div>

    </header>

  )
}