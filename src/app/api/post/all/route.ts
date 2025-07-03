import { connectDB } from "@/lib/db"
import Post from "@/models/Post";
import { NextResponse } from "next/server";

export async function GET() {
    await connectDB();

    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate("owner", "fullName username avatar")

        return NextResponse.json({ posts })
    } catch (error) {
        console.error("Error fetching posts:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
