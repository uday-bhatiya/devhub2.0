import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Cards from "./Card"


const HomeFeed = () => {
    return (
        <Tabs defaultValue="all" className="w-full h-full">
            <TabsList className="grid grid-cols-3 w-[400px]">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="collabs">Collabs</TabsTrigger>
            </TabsList>
            <TabsContent className="flex gap-3 flex-wrap" value="all">
                <Cards />
                <Cards />
                <Cards />
                <Cards />
            </TabsContent>
            <TabsContent value="posts">
                <Cards />
            </TabsContent>
            <TabsContent value="collabs">
                <Cards />
            </TabsContent>
        </Tabs>

    )
}

export default HomeFeed