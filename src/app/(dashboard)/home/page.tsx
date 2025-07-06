"use client"

import ActionBar from "@/components/ActionBar"
import HomeFeed from "@/components/HomeFeed"
import { useAuth } from "@/context/AuthContext"

export default function HomePage() {
  const { user } = useAuth()

  return (
    <div className="w-full bg-[#0D1117] text-white">
      <div>
        <h1 className="text-4xl font-bold">Welcome back, {user?.fullName} 👋</h1>
        <p className="text-muted-foreground mt-2 text-slate-500 ">
          Here&apos;s what&apos;s happening in the DevHub community.
        </p>
      </div>
      <ActionBar />
      <HomeFeed />
    </div>
  )
}
