import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { getUserFromToken } from "@/lib/auth"
import { User } from "@/models/User"

export async function PATCH(req: NextRequest) {
    await connectDB();

    try {
        const user = await getUserFromToken(req);
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()

        const updateData: any = {
            fullName: body.fullName,
            username: body.username,
            email: body.email,
            about: body.about || '',
            skills: body.skills || [],
        }

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
