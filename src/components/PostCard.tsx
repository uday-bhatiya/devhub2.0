import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

type PostCardProps = {
    id: string
    title: string
    description: string
    image: string[]
    creatorName: string
    postedAt: string
}

const PostCard = ({
    id,
    title,
    description,
    image,
    creatorName,
    postedAt,

}: PostCardProps) => {
    console.log(id)

    return (
        <Card className="flex flex-row justify-between items-start w-[48%] px-6 py-4">
            <div className="flex flex-col gap-2">
                <CardHeader className="p-0">
                    <CardTitle className="text-lg font-bold text-blue-600">[Post] {title}</CardTitle>
                    <CardDescription className="text-gray-600">{description}</CardDescription>
                </CardHeader>
                <CardContent className="p-0 flex flex-col gap-2 mt-2">
                    <span className="text-xs text-muted-foreground">
                        Posted {postedAt} by {creatorName}
                    </span>
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