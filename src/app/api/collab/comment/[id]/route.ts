import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { getUserFromToken } from "@/lib/auth"
import CollabPost from "@/models/CollabPost";

export async function POST(req: NextRequest, context: any) {
    await connectDB();

      const { id } = context.params;

    try {
        const user = await getUserFromToken();
        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

        const { text } = await req.json()
 
        if (!text) return NextResponse.json({ message: "Comment cannot be empty" }, { status: 400 })

        const post = await CollabPost.findById(id)
        if (!post) return NextResponse.json({ message: "Post not found" }, { status: 404 })

        post.comments.push({ user: user._id, text })
        await post.save()

        return NextResponse.json({ message: "Comment added", comments: post.comments })
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}
