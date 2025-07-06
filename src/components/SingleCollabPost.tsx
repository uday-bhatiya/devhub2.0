"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"
import { applyToCollabPost, commentOnCollabPost, decideOnApplicant, fetchCollabPostById, likeOnCollabPost } from "@/lib/api"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { Heart, MessageCircle, Share2, User } from "lucide-react"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { AvatarImage } from "@radix-ui/react-avatar"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Input } from "./ui/input"

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

type Applicant = {
    _id: string
    message: string
    status: "selected" | "rejected" | "pending"
    createdAt: string
    user: {
        avatar?: string
        email: string
        username: string
        fullName: string
        _id: string
    }
}

type CollabPost = {
    _id: string
    title: string
    description: string
    requiredSkills: string[]
    githubLink: string
    createdAt: string
    creator: {
        fullName: string
        _id: string
        avatar: string
        username: string
    }
    applicants: Applicant[]
    likes: string[]
    comments: Comment[]
}


const SingleCollabPost = () => {

    const { id } = useParams()
    const [post, setPost] = useState<CollabPost | null>(null);
    const [text, setText] = useState("")
    const [comments, setComments] = useState<Comment[]>([])
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [isApplying, setIsApplying] = useState(false);
    const [copied, setCopied] = useState(false)
    const [applicants, setApplicants] = useState<Applicant[]>([]);

    const { user, loading, setLoading } = useAuth();

    const handleApply = async () => {
        if (!message.trim()) {
            return toast.warning("Please enter a message!!")
        }

        try {
            setIsApplying(true)
            await applyToCollabPost(id as string, message);
            toast.success("Application sent successfully");
            setMessage("");
        } catch (err) {
            console.error(err)
            toast.error("Failed to apply")
        } finally {
            setIsApplying(false)
        }
    }

    const handleLike = async () => {
        try {
            const res = await likeOnCollabPost(id as string);
            const { liked } = res.data;

            setPost(prev => {
                if (!prev || !user) return prev;

                let updatedLikes;
                if (liked) {
                    updatedLikes = [...prev.likes, user._id];
                } else {
                    updatedLikes = prev?.likes?.filter(uid => uid !== user._id);
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
            const res = await commentOnCollabPost(post._id, text);
            console.log("REEEEE", res.data)
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
            const url = `${window.location.origin}/collab/${id}`
            await navigator.clipboard.writeText(url)

            setCopied(true)
            toast.success("Link copied to clipboard!")

            setTimeout(() => setCopied(false), 4500)
        } catch (error) {
            toast.success("Failed to copy link")
        }
    }

    const handleDecision = async (userId: string, status: "selected" | "rejected") => {
        if (!post) return;
        try {
            await decideOnApplicant(post._id, userId, status);
            toast.success(`Applicant ${status}`);

            // Optimistically update UI
            setApplicants((prev) =>
                prev.map((app) =>
                    app.user._id === userId ? { ...app, status } : app
                )
            );
        } catch (error) {
            console.error("Error updating applicant:", error);
            toast.error("Failed to update applicant");
        }
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetchCollabPostById(id as string);
                setPost(res.data.post);
                console.log(res.data)
                setComments(res.data.post.comments)
                setApplicants(res.data.post.applicants)
            } catch (err) {
                console.error("Error loading post", err)
            }
        }

        fetchData()
    }, [id]);

    if (!post) return <div className="text-center py-20">Loading post...</div>

    const alreadyApplied = post.applicants.some(app => app.user._id === user?._id)
    const isOwner = post.creator._id === user?._id

    return (
        <div className="max-w-3xl mx-auto py-12 px-4">
            <Card>
                <CardHeader>
                    <Link href={`/user/${post.creator.username}`} className="flex items-center gap-3">

                        <div className="flex items-center gap-3 mt-4">
                            <Avatar className="h-10 w-10 cursor-pointer">
                                <AvatarImage src={post.creator.avatar || ""} />
                                <AvatarFallback>{user?.fullName ? user.fullName.charAt(0) : ""}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold cursor-pointer">{post.creator.fullName}</p>
                                <p className="text-sm text-muted-foreground cursor-pointer">@{post.creator.username || "user"}</p>
                            </div>
                        </div>
                    </Link>

                    <CardTitle className="text-2xl font-bold text-blue-600">
                        [Collab] {post.title}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-gray-800">{post.description}</p>

                    <div>
                        <h3 className="text-md font-semibold">Required Skills:</h3>
                        <div className="flex gap-2 flex-wrap mt-1">
                            {post.requiredSkills.map((skill, idx) => (
                                <Badge key={idx}>
                                    {skill}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <p className="text-sm text-muted-foreground">
                        Posted {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })} by{" "}
                        {isOwner ? "You" : post.creator.fullName}
                    </p>

                    {!alreadyApplied && !isOwner && (
                        <div className="pt-2">
                            <h4 className="font-medium mb-1">Message to Creator:</h4>
                            <Textarea
                                placeholder="Why are you a good fit?"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </div>
                    )}

                    <div className="flex gap-3">

                        {!alreadyApplied && !isOwner && (
                            <Button
                                disabled={isApplying}
                                onClick={handleApply}
                            >
                                Send request
                            </Button>
                        )}

                        {alreadyApplied && (
                            <span className="text-green-600 text-sm">Already applied ✅</span>
                        )}
                    </div>


                </CardContent>
                <CardFooter>
                    <div className="flex flex-wrap gap-4 pt-6 border-t mt-4">
                        <Button onClick={handleLike} className="flex items-center gap-2">
                            <Heart className="w-4 h-4" />
                            : {post?.likes ? post.likes.length : "0"}
                        </Button>

                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="flex items-center gap-2">
                                    <MessageCircle className="w-4 h-4" />
                                    : {post?.comments ? post.comments.length : "0"}
                                </Button>
                            </DialogTrigger>

                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle className="text-black">Add a Comment</DialogTitle>
                                </DialogHeader>

                                <Input
                                    placeholder="Write your comment..."
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                />
                                <div className="mt-4 max-h-60 overflow-y-auto space-y-4 text-black">
                                    {Array.isArray(comments) && comments.length > 0 ? (
                                        [...comments].reverse().map((comment) => {
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


                        {post.githubLink && (
                            <Link href={post.githubLink} target="_blank">
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

                        {isOwner && (
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button className="flex items-center gap-2">
                                        <User />
                                    </Button>
                                </DialogTrigger>

                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle className="text-black">Collab Requiests</DialogTitle>
                                    </DialogHeader>

                                    <div className="mt-4 max-h-60 overflow-y-auto space-y-4 text-black">
                                        {Array.isArray(post.applicants) && post.applicants.length > 0 ? (
                                            [...applicants].reverse().map((applicant) => {
                                                if (!applicant || typeof applicant !== "object" || !applicant.user || applicant.status !== "pending") {
                                                    return null;
                                                }

                                                return (
                                                    <div key={applicant._id} className="flex items-start justify-between gap-3 border-b pb-2 my-2 bg-black">
                                                        <div className="flex items-start gap-3">
                                                            <Link href={`/user/${applicant.user.username}`}>
                                                                <Avatar className="h-8 w-8">
                                                                    <AvatarImage src={applicant.user.avatar || ""} />
                                                                    <AvatarFallback>{applicant.user.fullName?.charAt(0) || "?"}</AvatarFallback>
                                                                </Avatar>
                                                            </Link>
                                                            <div className="m-w-[70%]">
                                                                <Link href={`/user/${applicant.user.username}`}>
                                                                    <p className="text-sm font-semibold">@{applicant.user.username || "unknown"}</p>
                                                                </Link>
                                                                <p className="text-sm text-gray-700">{applicant.message}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col gap-2">
                                                            <Button onClick={() => handleDecision(applicant.user._id, "selected")} className="w-3 h-3">Y</Button>
                                                            <Button onClick={() => handleDecision(applicant.user._id, "rejected")} className="w-3 h-3">N</Button>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <p className="text-sm text-muted-foreground">No comments yet.</p>
                                        )}
                                    </div>
                                </DialogContent>
                            </Dialog>
                        )}
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}

export default SingleCollabPost