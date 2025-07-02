"use client";

import { callGetApi, callPostApi } from "@/lib/api";
import { Comment } from "@/models/Comment";
import type { Post } from "@/models/Post";
import moment from "moment";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";

interface CommentsProps {
    post: Post;
}

const fetcher = async (url: string) => {
    try {
        const res = await callGetApi(url)
        return res?.data?.comments;
    } catch (error: any) {
        const errorMessage = error?.response?.data?.message || 'Unknown error';
        toast.error(errorMessage)
    }

};

const Comments: React.FC<CommentsProps> = ({ post }) => {
    const { status } = useSession();
    const { data, mutate, isLoading } = useSWR<Comment[]>(
        `/api/comments?id=${post?._id}`,
        fetcher
    );

    const [commentText, setCommentText] = useState("");

    const handleSubmit = async () => {
        if (!commentText.trim()) return;
        try {
            await callPostApi("/api/comments", { text: commentText, postId: post?._id });
            setCommentText("");
            mutate();
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || 'Unknown error';
            toast.error(errorMessage)
        }

    };

    return (
        <div className="mt-12">
            <h1 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-6">
                Comments
            </h1>

            {status === "authenticated" ? (
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-10">
                    <textarea
                        placeholder="Write a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="w-full p-4 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none"
                        rows={3}
                    />
                    <button
                        onClick={handleSubmit}
                        className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-5 py-2 rounded-md transition"
                    >
                        Send
                    </button>
                </div>
            ) : (
                <Link
                    href="/auth/login"
                    className="text-blue-600 dark:text-blue-400 underline"
                >
                    Login to write a comment
                </Link>
            )}

            <div className="space-y-10 mt-8">
                {isLoading ? (
                    <p className="text-gray-500 dark:text-gray-400">Loading comments...</p>
                ) : (
                    data?.map((item) => (
                        <div key={item._id?.toString()} className="space-y-3">
                            <div className="flex items-center gap-4">
                                {item?.user?.image && (
                                    <Image
                                        src={item.user.image}
                                        alt={item.user.name}
                                        width={50}
                                        height={50}
                                        className="rounded-full object-cover"
                                    />
                                )}
                                <div className="flex flex-col text-sm text-gray-600 dark:text-gray-300">
                                    <span className="font-medium">{item.user!.name}</span>
                                    <span className="text-xs text-gray-400 dark:text-gray-500">
                                        {moment(item.createdAt).format("MMM DD, YYYY")}
                                    </span>
                                </div>
                            </div>
                            <p className="text-base font-light text-gray-800 dark:text-gray-200">
                                {item.text}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Comments;
