import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "./ui/badge"

type PostCardProps = {
    id: string
    title: string
    description: string
    tags: string[]
    owner: string
    postedAt: string
}

const PostCard = ({
    id,
    title,
    description,
    tags,
    owner,
    postedAt,

}: PostCardProps) => {
    console.log(id)

    return (
        <Card className="flex md:flex-row justify-between items-start w-full md:w-[48%] md:px-6 px-2 py-4">
            <div className="flex flex-col gap-2">
                <CardHeader className="p-0">
                    <CardTitle className="text-lg font-bold text-blue-600"><Link href={`/post/${id}`}>[Post] {title}</Link></CardTitle>
                    <CardDescription className="text-gray-600">{description}</CardDescription>
                </CardHeader>
                <CardContent className="p-0 flex flex-col gap-2 mt-2">
                    <div className="flex gap-2 flex-wrap text-sm">
                        {tags.map((tag, idx) => (
                            <span key={idx} className="text-xs">
                                <Badge>{tag}</Badge>
                            </span>
                        ))}
                    </div>
                    <Link className="text-xs text-muted-foreground" href={`user/${owner}`}> Posted {postedAt} by {owner}</Link>
                </CardContent>
            </div>
            <div className="pt-4">
                <Link href={`/post/${id}`}>
                    <Button>
                        View
                    </Button>
                </Link>

            </div>
        </Card>
    )
}

export default PostCard;