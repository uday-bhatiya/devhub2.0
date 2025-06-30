"use client"

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { getCurrentUser } from "@/lib/api"
import ProfileFeed from "@/components/ProfileFeed"

const Page = () => {
  const { user, setUser } = useAuth()
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getCurrentUser()
        setUser(res.data.user)
      } catch (err) {
        console.error("Failed to fetch user:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [setUser])

  if (loading) return <div className="text-center py-20">Loading profile...</div>
  if (!user) return <div className="text-center py-20">No user found.</div>

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user.avatar || ""} />
            <AvatarFallback>{user?.fullName?.charAt(0) || "?"}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">{user.fullName}</h1>
            <p className="text-muted-foreground text-sm">
              @{user.username || "unknown"} • {user.email}
            </p>
            {user.headline && (
              <p className="text-base text-gray-600 mt-1">{user.headline}</p>
            )}
          </div>
        </div>
        <Button onClick={() => router.push("/user/edit-profile")}>Edit Profile</Button>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-2">About</h2>
        <p className="text-gray-700">{user.about || "No about info provided yet."}</p>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Skills</h2>
        <div className="flex gap-2 flex-wrap">
          {user.skills && user.skills.length > 0 ? (
            user.skills.map((skill, idx) => (
              <Badge key={idx}>{skill}</Badge>
            ))
          ) : (
            <p className="text-muted-foreground">No skills listed yet.</p>
          )}
        </div>
      </div>

      < ProfileFeed />
    </div>
  )
}

export default Page
