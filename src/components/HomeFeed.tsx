"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState } from "react";
import { fetchPublicCollabPosts, fetchPublicPosts } from "@/lib/api";
import CollabCard from "./CollabCard";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { Button } from "./ui/button";
import PostCard from "./PostCard";

interface Post {
    _id: string;
    title: string;
    tags: string[];
    description: string;
    owner?: {
        username?: string;
    };
    createdAt: string;
}

interface CollabPost {
    _id: string;
    title: string;
    description: string;
    requiredSkills: string[];
    createdAt: string;
    creator?: {
        username?: string;
    };
}



const HomeFeed = () => {

    const [posts, setPosts] = useState<Post[]>([]);
    const [collabPost, setCollabPost] = useState<CollabPost[]>([]);
    console.log(posts)
    console.log(collabPost)

    useEffect(() => {
        const load = async () => {
            const collabRes = await fetchPublicCollabPosts();
            const postRes = await fetchPublicPosts();
            setCollabPost(collabRes.data.posts);
            setPosts(postRes.data.posts);
        }
        load();
    }, []);

    return (
        <Tabs defaultValue="all" className="w-full h-full bg-[#0D1117] text-white">
            <TabsList className="grid grid-cols-3 w-[200px] md:w-[400px] bg-[#0D1117] text-white border-white">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="collabs">Collabs</TabsTrigger>
            </TabsList>
            <TabsContent className="flex gap-3 flex-wrap" value="all">
                {collabPost.slice(0, 4).map((post) => (
                    <CollabCard
                        key={post._id}
                        id={post._id}
                        title={post.title}
                        description={post.description.slice(0, 100) + "..."}
                        skills={post.requiredSkills}
                        creator={post.creator?.username || "Anonymous"}
                        postedAt={formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                    />
                ))} {posts.slice(0, 4).map((post) => (
                    <PostCard
                        key={post._id}
                        id={post._id}
                        title={post.title}
                        tags={post.tags}
                        description={post.description.slice(0, 100) + "..."}
                        owner={post.owner?.username || "Anonymous"}
                        postedAt={formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}  />
                ))
                }
            </TabsContent>
            <TabsContent className="flex gap-3 flex-wrap" value="posts">
                {posts.slice(0, 4).map((post) => (
                    <PostCard
                        key={post._id}
                        id={post._id}
                        title={post.title}
                        tags={post.tags}
                        description={post.description.slice(0, 100) + "..."}
                        owner={post.owner?.username || "Anonymous"}
                        postedAt={formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}  />
                ))
                }

                <Link href="/post/all">
                    <Button className="mt-3">View all Post</Button>
                </Link>
            </TabsContent>
            <TabsContent className="flex gap-3 flex-wrap" value="collabs">
                {collabPost.slice(0, 4).map((post) => (
                    <CollabCard
                        key={post._id}
                        id={post._id}
                        title={post.title}
                        description={post.description.slice(0, 100) + "..."}
                        skills={post.requiredSkills}
                        creator={post.creator?.username || "Anonymous"}
                        postedAt={formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                    />
                ))}
                <Link href="/collab/all">
                    <Button className="mt-3">View all Collab</Button>
                </Link>
            </TabsContent>
        </Tabs>

    )
}

export default HomeFeed