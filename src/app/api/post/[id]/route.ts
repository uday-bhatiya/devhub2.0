import { connectDB } from "@/lib/db"
import Post from "@/models/Post";
import { NextRequest, NextResponse } from "next/server"

export async function GET(_: NextRequest, context: any) {
    await connectDB();

    const { id } = context.params;

    try {
        const post = await Post.findById(id).populate("owner", "fullName avatar username")
            .populate({
                path: "comments",
                populate: {
                    path: "user",
                    select: "fullName avatar username"
                }
            });
        if (!post) return NextResponse.json({ message: "Post not found" }, { status: 404 })

        return NextResponse.json({ post });
    } catch (error) {
        console.error("Error fetching post:", error)
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }

}