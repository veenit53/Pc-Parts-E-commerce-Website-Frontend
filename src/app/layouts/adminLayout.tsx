import { AdminSidebar } from "../components/ui/adminsidebar"
import { AdminHeader } from "../components/ui/adminheader"

export function AdminLayout({ children }: any) {

  return (

    <div className="flex bg-[#0f172a] min-h-screen">

      <AdminSidebar/>

      <div className="flex-1">

        <AdminHeader/>

        <main className="p-8">
          {children}
        </main>

      </div>

    </div>

  )

}