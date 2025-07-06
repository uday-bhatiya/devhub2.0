"use client"

import { fetchPublicPosts } from "@/lib/api"
import { useEffect, useState } from "react"
import { formatDistanceToNow } from "date-fns"
import PostCard from "@/components/PostCard"

export default function ExploreCollabPosts() {

  const [posts, setPosts] = useState([]);

  console.log(posts)

  useEffect(() => {
    const load = async () => {
      const res = await fetchPublicPosts();
      setPosts(res.data.posts)
    }
    load()
  }, [])

  return (
    <main className="w-full flex flex-col gap-6 p-6 items-center">
      <h1 className="text-2xl font-bold">Explore Posts</h1>
      <div className="w-full flex gap-4 flex-wrap">
      {posts.map((post: Record<string, any>) => (
          <PostCard
            key={post._id}
            tags={post.tags}
            id={post._id}
            title={post.title}
            description={post.description.slice(0, 100) + "..."}
            owner={post.owner?.fullName || "Anonymous"}
            postedAt={formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            image={post.images? post.images : ""}
          />
        ))}
      </div>
    </main>
  )
}
