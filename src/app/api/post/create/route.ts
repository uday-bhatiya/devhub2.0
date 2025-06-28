import { NextRequest, NextResponse } from "next/server"
import Post from "@/models/Post"
import { getUserFromToken } from "@/lib/auth"
import { connectDB } from "@/lib/db"

export async function POST(req: NextRequest) {
    await connectDB();

    try {
        const user = await getUserFromToken(req)
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()

        const newPost = await Post.create({
            ...body,
            owner: user._id,
        });

        return NextResponse.json({ post: newPost }, { status: 201 })
    } catch (error) {
        console.error("Error creating post:", error)
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }

}
