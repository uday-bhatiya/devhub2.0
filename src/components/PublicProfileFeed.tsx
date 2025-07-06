"use client"

import React, { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { getAllPublicUserCollabPosts, getAllPublicUserPosts } from '@/lib/api'
import { toast } from 'sonner'
import PostCard from './PostCard'
import { formatDistanceToNow } from 'date-fns'
import CollabCard from './CollabCard'

type PublicProfileFeedProps = {
    userId: string
    owner: string
}

interface PublicPost {
    _id: string;
    title: string;
    description: string;
    tags: string[];
    createdAt: string;
}

interface PublicCollab {
    _id: string;
    title: string;
    description: string;
    requiredSkills: string[];
    createdAt: string;
    applicants: string[];
}


const PublicProfileFeed = ({ userId, owner }: PublicProfileFeedProps) => {

    const [posts, setPosts] = useState<PublicPost[]>([]);
    const [collabs, setCollabs] = useState<PublicCollab[]>([]);


    useEffect(() => {
        const getAllPost = async () => {
            try {
                const postRes = await getAllPublicUserPosts(userId);
                const collabRes = await getAllPublicUserCollabPosts(userId);

                console.log("Post red", postRes)
                setPosts(postRes?.data || []);
                setCollabs(collabRes?.data || []);
            } catch (error) {
                console.error("Failed to fetch posts:", error);
                toast.error("Failed to fetch posts");
            }
        };

        getAllPost();
    }, [userId]);

    useEffect(() => {
        console.log("Updated Posts:", posts);
    }, [posts]);

    useEffect(() => {
        console.log("Updated Collabs:", collabs);
    }, [collabs]);



    return (
        <Tabs defaultValue="posts" className="w-full h-full mt-4">
            <TabsList className="grid grid-cols-2 w-[200px] md:w-[400px]">
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="collabs">Collabs</TabsTrigger>
            </TabsList>
            <TabsContent className="flex gap-3 flex-wrap" value="posts">
                {
                    posts && posts.map((post: PublicPost) => (
                        <PostCard
                            key={post._id}
                            id={post._id}
                            tags={post.tags}
                            title={post.title}
                            description={post.description.slice(0, 100) + "..."}
                            owner={owner || "Anonymous"}
                            postedAt={formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                        />
                    ))
                }


            </TabsContent>
            <TabsContent className="flex gap-3 flex-wrap" value="collabs">

                {
                    collabs && collabs.map((post: PublicCollab) => (
                        <CollabCard
                            key={post._id}
                            id={post._id}
                            title={post.title}
                            description={post.description.slice(0, 100) + "..."}
                            skills={post.requiredSkills}
                            creator={owner || "Anonymous"}
                            postedAt={formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                        />
                    ))
                }
            </TabsContent>
        </Tabs>
    )
}

export default PublicProfileFeed