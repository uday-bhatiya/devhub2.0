"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Cards from "./Card"
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { fetchPublicCollabPosts } from "@/lib/api";
import CollabCard from "./CollabCard";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { Button } from "./ui/button";


const HomeFeed = () => {

    const [posts, setPosts] = useState([]);
    const { user } = useAuth();
    console.log(posts)

    useEffect(() => {
        const load = async () => {
            const res = await fetchPublicCollabPosts()
            setPosts(res.data.posts)
        }
        load()
    }, [])

    return (
        <Tabs defaultValue="all" className="w-full h-full">
            <TabsList className="grid grid-cols-3 w-[400px]">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="collabs">Collabs</TabsTrigger>
            </TabsList>
            <TabsContent className="flex gap-3 flex-wrap" value="all">
                {posts.slice(0, 4).map((post: any) => (
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
            </TabsContent>
            <TabsContent value="posts">
                <Cards />
            </TabsContent>
            <TabsContent className="flex gap-3 flex-wrap" value="collabs">
                {posts.slice(0, 4).map((post: any) => (
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
            </TabsContent>
            <Link href="/collab/all">
                <Button className="mt-3">View all Collab</Button>
            </Link>
        </Tabs>

    )
}

export default HomeFeed