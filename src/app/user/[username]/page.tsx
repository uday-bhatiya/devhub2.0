"use client";

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { fetchUserByUsername, getAllPublicUserCollabPosts, getAllPublicUserPosts, toggleFollowUser } from '@/lib/api';
import { set } from 'mongoose';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

type PublicUser = {
  _id: string
  fullName: string
  username: string
  avatar?: string
  headline?: string
  about?: string
  skills: string[]
  followers: { _id: string }[]
}

const page = () => {

  const [publicUser, setPublicUser] = useState<PublicUser | null>(null);
  const { username } = useParams();

  const router = useRouter();

  const { user, loading, setLoading } = useAuth();

  const isFollowing = publicUser?.followers.some(follower => follower._id === user?._id);
  const followCount = publicUser?.followers.length || 0;

  // console.log(username)

const handleToggleFollow = async (userId: string) => {
  try {
    setLoading(true);
    const res = await toggleFollowUser(userId);
    const isNowFollowing = res.data.following;

    if (publicUser && user) {
      setPublicUser(prev => {
        if (!prev) return prev;
        const alreadyFollowing = prev.followers.some(f => f._id === user._id);

        return {
          ...prev,
          followers: isNowFollowing
            ? [...prev.followers, { _id: user._id }] // F Add 
            : prev.followers.filter(f => f._id !== user._id) // F Remove
        };
      });
    }

  } catch (error) {
    console.error("Failed to toggle follow status", error);
  } finally {
    setLoading(false);
  }
}

const fetchUserPosts = async (userId: string) => {
  try {
    const res = await getAllPublicUserPosts(userId);
    console.log(res.data)
  } catch (error) {
    console.error("Failed to fetch user posts:", error)
    console.log(error);
  }
}

const fetchUserCollabPosts = async (userId: string) => {
  try {
    const res = await getAllPublicUserCollabPosts(userId);
    console.log(res.data)
  } catch (error) {
    console.error("Failed to fetch user posts:", error)
    console.log(error);
  }
}

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetchUserByUsername(username as string);
      setPublicUser(res.data.user);
    }

    fetchUser();
  }, [username])

  useEffect(() => {
    if (publicUser?._id) {
      fetchUserPosts(publicUser._id);
      fetchUserCollabPosts(publicUser._id);
    }
  }, [publicUser]);

  if (username === user?.username) router.push('/profile');

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={publicUser?.avatar || ""} />
            <AvatarFallback>{publicUser?.fullName?.charAt(0) || "?"}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">{publicUser?.fullName || "Unknown User"}</h1>
            <p className="text-muted-foreground text-sm">
              @{publicUser?.username || "unknown"}
            </p>
            {publicUser?.headline && (
              <p className="text-base text-gray-600 mt-1">{publicUser.headline}</p>
            )}
          </div>
        </div>

      </div>

      <div className="mt-4 flex items-center gap-4">
        <p className="text-sm text-gray-600">{followCount} followers</p>
        <Badge
          onClick={() => {
            if (publicUser?._id) handleToggleFollow(publicUser?._id);
          }}
          className='cursor-pointer'
        >
          {loading ? ("Loading...") : (
            isFollowing ? "Unfollow" : "Follow")}
        </Badge>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-2">About</h2>
        <p className="text-gray-700">{publicUser?.about || "No about info provided yet."}</p>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Skills</h2>
        <div className="flex gap-2 flex-wrap">
          {publicUser?.skills && publicUser.skills.length > 0 ? (
            publicUser.skills.map((skill, idx) => (
              <Badge key={idx}>{skill}</Badge>
            ))
          ) : (
            <p className="text-muted-foreground">No skills listed yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default page