import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { getUserFromToken } from "@/lib/auth"
import { User } from "@/models/User"

export async function PATCH(req: NextRequest) {
    await connectDB();

    try {
        const user = await getUserFromToken();
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        // console.log(body)

        const updateData: {
            fullName?: string;
            username?: string;
            email?: string;
            headline?: string;
            about?: string;
            skills?: string[];
            avatar?: string;
        } = {
            fullName: body.fullName,
            username: body.username,
            email: body.email,
            headline: body.headline || '',
            about: body.about || '',
            skills: body.skills || [],
            avatar: body.avatar
        };

        const existingUsername = await User.findOne({ username: body.username })
        if (existingUsername && existingUsername._id.toString() !== user._id.toString()) {
            return NextResponse.json({ message: "Username already taken" }, { status: 400 });
        }

        const existingEmail = await User.findOne({ email: body.email })
        if (existingEmail && existingEmail._id.toString() !== user._id.toString()) {
            return NextResponse.json({ message: "Email already in use" }, { status: 400 });
        }

        const updatedUser = await User.findByIdAndUpdate(user._id, updateData, { new: true });

        return NextResponse.json({ user: updatedUser });
    } catch (error) {
        console.error("Error updating user profile:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
