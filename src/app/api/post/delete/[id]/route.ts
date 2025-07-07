import { getUserFromToken } from "@/lib/auth"
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import { NextRequest, NextResponse } from "next/server"

export async function DELETE(_: NextRequest, context: any) {
    await connectDB();

    const { id } = context.params;
    try {
        const user = await getUserFromToken();
        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

        const existingPost = await Post.findById(id)
        if (!existingPost) return NextResponse.json({ message: "Post not found" }, { status: 404 })
        if (existingPost.owner.toString() !== user._id.toString())
            return NextResponse.json({ message: "Forbidden" }, { status: 403 })

        await Post.findByIdAndDelete(id)
        return NextResponse.json({ message: "Post deleted" });
    } catch (error) {
        console.error("Error deleting post:", error)
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}