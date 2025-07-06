'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { Heart, MessageCircle, Share2, } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { commentOnPost, fetchPostById, likeOnPost } from '@/lib/api'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Input } from './ui/input'
import { toast } from 'sonner'

type Comment = {
    _id: string
    text: string
    createdAt: string
    user: {
        fullName: string
        avatar?: string
        username?: string
    }
}

type Post = {
    _id: string
    title: string
    description: string
    image?: string
    tags?: string[]
    githubUrl?: string
    createdAt: string
    likes: string[]
    comments: Comment[]
    owner: {
        fullName: string
        _id: string
        username?: string
        avatar?: string
    }
}

export default function SinglePostPage() {
    const [post, setPost] = useState<Post | null>(null)
    const [text, setText] = useState("")
    const [comments, setComments] = useState<Comment[]>([])
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [copied, setCopied] = useState(false)
    const { id } = useParams();

    const { user, loading, setLoading } = useAuth();

    console.log(post)

    const handleLike = async () => {
        try {
            const res = await likeOnPost(id as string);
            const { liked } = res.data;

            setPost(prev => {
                if (!prev || !user) return prev;

                let updatedLikes;
                if (liked) {
                    updatedLikes = [...prev.likes, user._id];
                } else {
                    updatedLikes = prev.likes.filter(uid => uid !== user._id);
                }

                return { ...prev, likes: updatedLikes };
            });
        } catch (error) {
            console.error("Error liking post", error);
        }
    };

    const handleComment = async () => {
        if (!post || !text.trim()) return;

        setLoading(true);
        try {
            const res = await commentOnPost(post._id, text);
            const newComment = res.data.comments;
            console.log(res.data)

            setComments(prev => [newComment, ...prev]);

            setPost(prev => {
                if (!prev) return prev;
                return { ...prev, comments: [...prev.comments, newComment._id] };
            });

            setText("");
            setIsDialogOpen(false);
        } catch (error) {
            console.error("Failed to add comment:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleShare = async () => {
        try {
            const url = `${window.location.origin}/post/${id}`
            await navigator.clipboard.writeText(url)

            setCopied(true)
            toast.success("Link copied to clipboard!")

            setTimeout(() => setCopied(false), 4500)
        } catch (error) {
            toast.success("Failed to copy link")
            console.log(error)
        }
    }

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetchPostById(id as string);
                setPost(res.data.post)
                setComments(res.data.post.comments)
            } catch (error) {
                console.error("Error loading post", error)
            }
        }

        fetchPost()
    }, [id])

    if (!post) return <div className="text-center py-20">Loading...</div>

    const isOwner = post.owner._id === user?._id

    return (
        <Card>
            <CardHeader>

                <Link href={`/user/${post.owner.username}`} className="flex items-center gap-3">

                    <div className="flex items-center gap-3 mt-4">
                        <Avatar className="h-10 w-10 cursor-pointer">
                            <AvatarImage src={post.owner.avatar || ""} />
                            <AvatarFallback>{user?.fullName ? user.fullName.charAt(0) : ""}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold cursor-pointer">{post.owner.fullName}</p>
                            <p className="text-sm text-muted-foreground cursor-pointer">@{post.owner.username || "user"}</p>
                        </div>
                    </div>
                </Link>
                <CardTitle className="text-2xl font-bold text-blue-600">
                    [Post] {post.title}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {post.image && (
                    <div className="w-full h-[250px] relative rounded-md overflow-hidden">
                        <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover"
                        />
                    </div>
                )}

                <div>
                    <h2 className="text-lg font-semibold mb-1">Description</h2>
                    <p className="text-gray-800">{post.description}</p>
                </div>

                {post.tags && post.tags.length > 0 && (
                    <div>
                        <h2 className="text-lg font-semibold mb-1">Tags</h2>
                        <div className="flex gap-2 flex-wrap">
                            {post.tags.map((tag, idx) => (
                                <Badge key={idx}>
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                <p className="text-sm text-muted-foreground pt-4">
                    Posted {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })} by{" "}
                    {isOwner ? "You" : post.owner.fullName}
                </p>
            </CardContent>

            <CardFooter>
                <div className="flex flex-wrap gap-4 pt-6 border-t mt-4">
                    <Button onClick={handleLike} className="flex items-center gap-2">
                        <Heart className="w-4 h-4" />
                        : {post.likes.length}
                    </Button>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="flex items-center gap-2">
                                <MessageCircle className="w-4 h-4" />
                                : {post.comments.length}
                            </Button>
                        </DialogTrigger>

                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add a Comment</DialogTitle>
                            </DialogHeader>

                            <Input
                                placeholder="Write your comment..."
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            />

                            <div className="mt-4 max-h-60 overflow-y-auto space-y-4">
                                {Array.isArray(comments) && comments.length > 0 ? (
                                    comments.map((comment) => {
                                        if (!comment || typeof comment !== "object" || !comment.user) {
                                            return null;
                                        }

                                        return (
                                            <div key={comment._id} className="flex items-start gap-3 border-b pb-2">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={comment.user.avatar || ""} />
                                                    <AvatarFallback>{comment.user.fullName?.charAt(0) || "?"}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="text-sm font-semibold">@{comment.user.username || "unknown"}</p>
                                                    <p className="text-sm text-gray-700">{comment.text}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="text-sm text-muted-foreground">No comments yet.</p>
                                )}

                            </div>


                            <DialogFooter>
                                <Button onClick={handleComment} disabled={loading}>
                                    {loading ? "Posting..." : "Post"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>


                    {post.githubUrl && (
                        <Link href={post.githubUrl} target="_blank">
                            <Button className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                                    <path
                                        d="M12 .5C5.648.5.5 5.816.5 12.273c0 5.208 3.438 9.628 8.207 11.188.6.111.82-.27.82-.597 0-.295-.011-1.081-.017-2.121-3.338.745-4.042-1.645-4.042-1.645-.546-1.423-1.333-1.803-1.333-1.803-1.09-.768.083-.752.083-.752 1.204.087 1.838 1.276 1.838 1.276 1.07 1.883 2.809 1.338 3.494 1.023.107-.798.42-1.338.763-1.646-2.665-.311-5.467-1.39-5.467-6.183 0-1.366.465-2.484 1.23-3.36-.123-.308-.534-1.552.117-3.235 0 0 1.005-.33 3.3 1.276a11.38 11.38 0 0 1 3.006-.412 11.26 11.26 0 0 1 3.007.412c2.295-1.606 3.297-1.276 3.297-1.276.654 1.683.243 2.927.12 3.235.767.876 1.228 1.994 1.228 3.36 0 4.803-2.807 5.868-5.479 6.173.432.379.817 1.125.817 2.268 0 1.638-.015 2.96-.015 3.364 0 .331.217.715.825.593C20.063 21.895 23.5 17.474 23.5 12.273 23.5 5.816 18.352.5 12 .5Z" />
                                </svg>
                            </Button>
                        </Link>
                    )}
                    <Button
                        onClick={handleShare}
                        className="flex items-center gap-2"
                    >
                        <Share2 className="w-4 h-4" />
                        {copied ? "Copied!" : ""}
                    </Button>
                </div>
            </CardFooter>

        </Card>
    )
}
