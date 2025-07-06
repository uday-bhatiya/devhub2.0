"use client"
import { useEffect, useState } from "react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell } from "lucide-react"
import Link from "next/link"
import { getNotifications, markNotificationAsRead } from "@/lib/api"
import { Badge } from "./ui/badge"

type Notification = {
    _id: string
    message: string
    link: string
    read: boolean
    createdAt: string
}

export default function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([])

    useEffect(() => {
        getNotifications().then((res) => setNotifications(res.data))
    }, [])

    const handleRead = async (id: string) => {
        await markNotificationAsRead(id)
        setNotifications((prev) =>
            prev.map((n) => (n._id === id ? { ...n, read: true } : n))
        )
    }

    const unreadCount = notifications.filter((n) => !n.read).length

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                    <Badge className="relative py-2">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                            {unreadCount}
                        </span>
                    )}
                </Badge>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                    <DropdownMenuItem disabled>No notifications</DropdownMenuItem>
                ) : (
                    notifications.map((n) => (
                        <DropdownMenuItem
                            key={n._id}
                            onClick={() => handleRead(n._id)}
                            className={`${!n.read ? "bg-slate-100" : ""}`}
                        >
                            <Link href={n.link} className="w-full text-sm">
                                {n.message}
                            </Link>
                        </DropdownMenuItem>
                    ))
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
