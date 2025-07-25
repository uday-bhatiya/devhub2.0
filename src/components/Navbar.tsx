"use client"

import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
    Menubar,
    MenubarMenu,
    MenubarTrigger,
    MenubarContent,
    MenubarItem,
    MenubarSeparator,
} from "@/components/ui/menubar"
import { useAuth } from "@/context/AuthContext"
import { logoutUser } from "@/lib/api"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from "sonner"
import NotificationBell from "./NotificationBell"
import { Handshake } from "lucide-react"

const Navbar = () => {
    const router = useRouter()
    const { user, setUser } = useAuth();

    const handleLogout = async () => {
        await logoutUser()
        toast.success("Logout successful!");
        setUser(null)
        router.push("/login")
    }

    return (
        <Menubar className="justify-between w-full px-6 py-5 md:mx-20 my-3 border-b shadow-sm">
            <MenubarMenu>
                <MenubarTrigger className="font-bold text-black text-lg">
                    <Link className="flex items-center" href="/home"><Handshake /> DevHub</Link>
                </MenubarTrigger>
            </MenubarMenu>

            <MenubarMenu >
                <div className="md:flex items-center space-x-3 hidden">
                    <MenubarTrigger>
                        <Link href="/home">Home</Link>
                    </MenubarTrigger>
                    <MenubarTrigger>
                        <Link href="/collab/all">Collabs</Link>
                    </MenubarTrigger>
                    <MenubarTrigger>
                        <Link href="/post/all">Posts</Link>
                    </MenubarTrigger>
                </div>
            </MenubarMenu>

            <MenubarMenu>
                <MenubarTrigger>
                    <Avatar className="h-7 w-7 mx-2 cursor-pointer">
                        <AvatarImage src={user?.avatar || ""} />
                        <AvatarFallback>{user?.fullName ? user.fullName.charAt(0) : ""}</AvatarFallback>
                    </Avatar>
            <NotificationBell />
                </MenubarTrigger>
                <MenubarContent>
                    <MenubarItem>
                        <Link href="/profile">View Profile</Link>
                    </MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem onClick={handleLogout}>Logout</MenubarItem>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    )
}

export default Navbar
