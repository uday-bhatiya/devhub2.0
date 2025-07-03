import { NextRequest, NextResponse } from "next/server"

import { User } from "@/models/User"
import { connectDB } from "@/lib/db"
import { getUserFromToken } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {

    await connectDB();
    try {
        const currentUser = await getUserFromToken(req);

        if (!currentUser) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const targetUserId = params.id;
        // console.log(targetUserId)
        // console.log(currentUser._id)

        const current = await User.findById(currentUser._id);
        const target = await User.findById(targetUserId);
        // console.log(current)
        // console.log(target)

        if (!target) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const alreadyFollowing = current.following.includes(targetUserId);

        if (alreadyFollowing) {
            // Unfollow
            current.following.pull(targetUserId);
            target.followers.pull(currentUser._id);
            await current.save();
            await target.save();
            return NextResponse.json({ following: false });
        } else {
            // Follow
            current.following.push(targetUserId);
            target.followers.push(currentUser._id);
            await current.save();
            await target.save();
            return NextResponse.json({ following: true });
        }

    } catch (error) {
        console.error("Error in follow API:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });

    }
}
