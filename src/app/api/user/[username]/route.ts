import { connectDB } from "@/lib/db"
import { User } from "@/models/User";
import { NextRequest, NextResponse } from "next/server"

export async function GET(_: NextRequest, context: any) {
    await connectDB();
    const { username } = context.params;

    try {
        const user = await User.findOne({ username: username })
        .populate("followers", "username fullName avatar")
        .populate("following", "username fullName avatar")
        .select("-password -__v");
        if (!user){
          return NextResponse.json({ message: "User not found" }, { status: 404 })  
        } 
        // console.log(user)
        return NextResponse.json({ user });
    } catch (error) {
        console.error("Error fetching user:", error)
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }

}