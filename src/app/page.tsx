"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Handshake, Code, Users, Network } from "lucide-react"

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0D1117] text-white px-6 py-10">
      <nav className="flex justify-between items-center max-w-6xl mx-auto mb-20">
        <div className="flex items-center gap-2 text-2xl font-semibold">
          <Handshake className="w-6 h-6 text-purple-500" />
          DevHub
        </div>
      </nav>

      <section className="text-center max-w-3xl mx-auto mb-28">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
          Build and share projects with developers
        </h1>
        <p className="text-gray-400 text-lg mb-8">
          Connect with other developers to collaborate on projects, share your work, and expand your skills.
        </p>
        <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
          <Link href="/login">Get Started</Link>
        </Button>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto text-center">
        <div>
          <div className="text-purple-500 mb-4">
            <Handshake className="w-8 h-8 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Collaborate on Projects</h3>
          <p className="text-gray-400">
            Post collaboration opportunities and find developers to work with on your project.
          </p>
        </div>
        <div>
          <div className="text-purple-500 mb-4">
            <Code className="w-8 h-8 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Share your work</h3>
          <p className="text-gray-400">
            Share your projects with the community to get feedback, recognition, and contributions.
          </p>
        </div>
        <div>
          <div className="text-purple-500 mb-4">
            <Network className="w-8 h-8 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Grow your network</h3>
          <p className="text-gray-400">
            Connect with other developers, build relationships, and grow your professional network.
          </p>
        </div>
      </section>
    </main>
  )
}
