"use client"

import React, { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { getAllUserCollabPosts, getAllUserPosts } from '@/lib/api'
import { toast } from 'sonner'
import PostCard from './PostCard'
import { formatDistanceToNow } from 'date-fns'
import CollabCard from './CollabCard'
import { CollabPost, Post } from '@/lib/type'

const ProfileFeed = () => {

    const [posts, setPosts] = useState<Post[]>([]);
    const [collabs, setCollabs] = useState<CollabPost[]>([]);

    const getAllPost = async () => {
        try {
            const postRes = await getAllUserPosts();
            const collabRes = await getAllUserCollabPosts();
            setPosts(postRes.data.posts);
            setCollabs(collabRes.data.posts);
            console.log(collabRes.data)
            // console.log(posts)
        } catch (error) {
            console.error("Failed to fetch posts:", error);
            toast.error("Failed to fetch posts");
        }
    }

    useEffect(() => {
        getAllPost();
    }, [])


    return (
        <Tabs defaultValue="posts" className="w-full h-full mt-4">
            <TabsList className="grid grid-cols-2 w-[200px] md:w-[400px]">
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="collabs">Collabs</TabsTrigger>
            </TabsList>
            <TabsContent className="flex gap-3 flex-wrap" value="posts">
                {posts.map((post: Post) => (
                    <PostCard
                        key={post._id}
                        id={post._id? post._id : ""}
                        tags={post.tags}
                        title={post.title}
                        description={post.description.slice(0, 100) + "..."}
                        owner={post.owner?.username || "Anonymous"}
                        postedAt={formatDistanceToNow(new Date(post?.createdAt? post.createdAt : ""), { addSuffix: true })} />
                ))
                }

            </TabsContent>
            <TabsContent className="flex gap-3 flex-wrap" value="collabs">
                {collabs.map((post: CollabPost) => (
                    <CollabCard
                        key={post._id}
                        id={post._id}
                        title={post.title}
                        description={post.description.slice(0, 100) + "..."}
                        skills={post.requiredSkills}
                        creator={post.creator?.fullName || "Anonymous"}
                        postedAt={formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                    />
                ))}
            </TabsContent>
        </Tabs>
    )
}

export default ProfileFeed