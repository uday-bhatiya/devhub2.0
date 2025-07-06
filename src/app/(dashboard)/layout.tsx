import Navbar from "@/components/Navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full"> 
      <div className="w-full flex items-center justify-center bg-[#0D1117] text-white"><Navbar /></div>
      <main className="p-6 w-full md:max-w-3/4 mx-auto">{children}</main>
    </div>
  )
}
