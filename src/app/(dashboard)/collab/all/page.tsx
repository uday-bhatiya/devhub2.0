"use client"

import CollabCard from "@/components/CollabCard"
import { fetchPublicCollabPosts } from "@/lib/api"
import { useEffect, useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { useAuth } from "@/context/AuthContext"

export default function ExploreCollabPosts() {

  const [posts, setPosts] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const load = async () => {
      const res = await fetchPublicCollabPosts()
      setPosts(res.data.posts)
    }
    load()
  }, [])

  return (
    <main className="w-full flex flex-col gap-6 p-6 items-center">
      <h1 className="text-2xl font-bold">Explore Collaboration Posts</h1>
      <div className="w-full flex gap-4 flex-wrap">
        {posts.map((post: any) => (
          <CollabCard
            key={post._id}
            id={post._id}
            title={post.title}
            description={post.description.slice(0, 100) + "..."}
            skills={post.requiredSkills}
            creatorName={post.creator?.fullName || "Anonymous"}
            postedAt={formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            onApply={() => console.log("Apply to", post._id)}
            applicants={post.applicants}
            currentUserId={user?._id!}
          />
        ))}
      </div>
    </main>
  )
}
