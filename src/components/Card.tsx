import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

const Cards = () => {
    return (
        <Card className="flex flex-row w-max pr-5">
            <div>
                <CardHeader>
                    <CardTitle>[Collab]</CardTitle>
                    <CardDescription>
                        Build a React E-Commerce
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <p>Looking for UI/UX and Backend Devs</p>
                    <span>Posted 3 hours ago by John</span>
                </CardContent>
            </div>
            <div>
                <Button>Apply</Button>
            </div>

        </Card>
    )
}

export default Cards