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
        <Menubar className="justify-between w-4xl px-6 py-5 border-b shadow-sm">
            <MenubarMenu>
                <MenubarTrigger className="font-bold text-blue-600 text-lg">
                    <Link href="/home">DevHub 🚀</Link>
                </MenubarTrigger>
            </MenubarMenu>

            <MenubarMenu>
                <MenubarTrigger>Explore</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem>
                        <Link href="/home">Home</Link>
                    </MenubarItem>
                    <MenubarItem>
                        <Link href="/collab">Collab Posts</Link>
                    </MenubarItem>
                    <MenubarItem>
                        <Link href="/create-post">Create Post</Link>
                    </MenubarItem>
                </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
                <MenubarTrigger>
                    <Avatar className="h-7 w-7">
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
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
