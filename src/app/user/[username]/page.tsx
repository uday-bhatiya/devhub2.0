"use client";

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge';
import { fetchUserByUsername } from '@/lib/api';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

type PublicUser = {
  fullName: string
  username: string
  avatar?: string
  headline?: string
  about?: string
  skills: string[]
}

const page = () => {

    const [user, setUser] = useState<PublicUser | null>(null);
    const { username } = useParams();

    console.log(username)

    useEffect(() => {
        const fetchUser = async () => {
            const res = await fetchUserByUsername(username as string);
            setUser(res.data.user);
        }

        fetchUser();
    }, [username])

    useEffect(() => {
        console.log(user)
    }, [user])
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user?.avatar || ""} />
            <AvatarFallback>{user?.fullName?.charAt(0) || "?"}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">{user?.fullName || "Unknown User"}</h1>
            <p className="text-muted-foreground text-sm">
              @{user?.username || "unknown"}
            </p>
            {user?.headline && (
              <p className="text-base text-gray-600 mt-1">{user.headline}</p>
            )}
          </div>
        </div>

      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-2">About</h2>
        <p className="text-gray-700">{user?.about || "No about info provided yet."}</p>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Skills</h2>
        <div className="flex gap-2 flex-wrap">
          {user?.skills && user.skills.length > 0 ? (
            user.skills.map((skill, idx) => (
              <Badge key={idx}>{skill}</Badge>
            ))
          ) : (
            <p className="text-muted-foreground">No skills listed yet.</p>
          )}
        </div>
      </div>
 </div>
  )
}

export default page