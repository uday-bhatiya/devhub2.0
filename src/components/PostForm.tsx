"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { createPost } from "@/lib/api"

const formSchema = z.object({
    title: z.string().min(3, "Title is required"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    tags: z.string().min(1, "Skills are required"),
    githubLink: z.string().url("GitHub link must be a valid URL"),
})

type FormValues = z.infer<typeof formSchema>

const PostForm = () => {

    const router = useRouter();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            tags: "",
            githubLink: "",
        },
    });

    async function onSubmit(values: FormValues) {
        try {
            const payload = {
                ...values,
                tags: values.tags.split(",").map(tag => tag.trim())
            }

            const res = await createPost(payload);

            toast.success("Post created successfully!")

            router.push("/home");
        } catch (error) {
            console.error(error);
            toast.error("Failed to create Post. Please try again.");
        }
    }


    return (
        <div className="max-w-2xl mx-auto mt-10">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl><Input placeholder="Exited to share my Portfolio..." {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl><Textarea placeholder="Describe your project and what you have build..." {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="tags"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tags (comma separated)</FormLabel>
                                <FormControl><Input placeholder="React, Tailwind, Firebase" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="githubLink"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>GitHub Repo</FormLabel>
                                <FormControl><Input placeholder="https://github.com/your-repo" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full">Create Post</Button>
                </form>
            </Form>
        </div>
    )
}

export default PostForm