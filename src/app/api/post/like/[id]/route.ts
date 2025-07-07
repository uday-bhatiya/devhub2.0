import { NextRequest, NextResponse } from "next/server"
import Post from "@/models/Post"
import { connectDB } from "@/lib/db"
import { getUserFromToken } from "@/lib/auth"

export async function PATCH(req: NextRequest, context: any) {
    await connectDB();
   const { id } = context.params;

    try {
        const user = await getUserFromToken();
        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const post = await Post.findById(id);
        if (!post) return NextResponse.json({ message: "Post not found" }, { status: 404 });

        const alreadyLiked = post.likes.includes(user._id);

        if (alreadyLiked) {
            post.likes.pull(user._id);
        } else {
            post.likes.push(user._id);
        }

        await post.save();
        return NextResponse.json({ liked: !alreadyLiked, totalLikes: post.likes.length })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}
