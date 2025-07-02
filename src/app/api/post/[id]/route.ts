import { connectDB } from "@/lib/db"
import Post from "@/models/Post";
import { NextRequest, NextResponse } from "next/server"

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
    await connectDB();

    try {
        const post = await Post.findById(params.id).populate("owner", "fullName avatar username");
        if (!post) return NextResponse.json({ message: "Post not found" }, { status: 404 })

        return NextResponse.json({ post });
    } catch (error) {
        console.error("Error fetching post:", error)
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }

}