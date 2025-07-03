import Navbar from "@/components/Navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="w-full flex items-center justify-center"><Navbar /></div>
      <main className="p-6 max-w-3/4 mx-auto">{children}</main>
    </div>
  )
}
