"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "./ui/input"
import { Search } from "lucide-react"
import Link from "next/link"

const ActionBar = () => {
    const [search, setSearch] = useState("")

    const handleSearch = () => {
        if (!search.trim()) return
        console.log("Searching for:", search)

    }

    return (
        <div className="my-4 flex flex-wrap items-center gap-4 sm:gap-6">
            <Button className="w-full sm:w-40">
                <Link href="/post/new">Create Post</Link>
            </Button>
            <Button className="w-full sm:w-40">
                <Link href="/collab/new">Create Collab</Link>
            </Button>

            <div className="flex gap-2 items-center justify-center">
                <div className="flex w-full sm:w-auto items-center gap-2 border rounded-md px-3 bg-white shadow-sm">
                    <Search className="h-4 w-4 text-gray-500" />
                    <Input
                        placeholder="Search"
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        className="border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                </div>
                <Button
                    size="sm"
                    onClick={handleSearch}
                    className="text-sm"
                >
                    <Search />
                </Button>
            </div>
        </div>
    )
}

export default ActionBar
