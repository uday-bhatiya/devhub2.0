import { NextRequest, NextResponse } from "next/server"
import Post from "@/models/Post"
import { connectDB } from "@/lib/db"
import { getUserFromToken } from "@/lib/auth"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    await connectDB();

    try {
        const user = await getUserFromToken(req);
        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

        const { text } = await req.json()
 
        if (!text) return NextResponse.json({ message: "Comment cannot be empty" }, { status: 400 })

        const post = await Post.findById(params.id)
        if (!post) return NextResponse.json({ message: "Post not found" }, { status: 404 })

        post.comments.push({ user: user._id, text })
        await post.save()

        return NextResponse.json({ message: "Comment added", comments: post.comments })
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}
