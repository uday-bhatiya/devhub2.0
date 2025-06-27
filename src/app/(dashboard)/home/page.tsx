"use client"

import { useAuth } from "@/context/AuthContext"

export default function HomePage() {
  const { user } = useAuth()

  return (
    <div>
      <h1 className="text-3xl font-bold">Welcome back, {user?.fullName} 👋</h1>
      <p className="text-muted-foreground mt-2">This is your dashboard home.</p>
    </div>
  )
}
