"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { registerUser } from "@/lib/api"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useAuth } from "@/context/AuthContext"


const formSchema = z.object({
    fullName: z.string().min(3, "Full name is required"),
    email: z.string().email("Invalid email address").min(1, "Email is required"),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
})

export default function page() {

    const router = useRouter();
    const { setUser } = useAuth();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        try {
            const res = await registerUser(values);
            toast.success("Registration successful!");
            setUser(res.data.user);
            router.push("/profile");
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Registration failed");
        }
    }

    return (
        <div className="flex items-center justify-center h-screen">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-1/3">
                    <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="Enter your full name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="Enter your email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="Enter your password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </div>
    )
}
