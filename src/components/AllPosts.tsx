import { callGetApi } from "@/lib/api";
import type { Post } from "@/models/Post";

import React from "react";
import Pagination from "./Pagination";
import PostItem from "./PostItem";

interface AllPostsProps {
    page: number;
    userId?: string
}


interface PostResponse {
    posts: Post[];
    count: number;
}

const getData = async (page: number, userId?: string): Promise<PostResponse> => {

    try {
        const url = `/api/posts?page=${page}&userId=${userId || ''}`
        console.log("urlurl", url)
        const res = await callGetApi(url, false)

        if (!res.data?.posts) {
            throw new Error("Failed to fetch posts");
        }

        return res.data as PostResponse;
    }
    catch (error) {
        console.log("Error", error)
        return {
            count: 0,
            posts: []
        }
    }
};

const AllPosts: React.FC<AllPostsProps> = async ({ page, userId }) => {
    const { posts, count } = await getData(page, userId);

    const POST_PER_PAGE = 2;

    const hasPrev = POST_PER_PAGE * (page - 1) > 0;
    const hasNext = POST_PER_PAGE * (page - 1) + POST_PER_PAGE < count;

    return (
        <div className="flex-1">

            <div className="flex flex-col gap-12">
                {posts?.map((item) => (
                    <PostItem userId={userId} item={item} key={item._id.toString()} />
                ))}
            </div>

            {!count &&
                <div className="self-center text-center font-bold text-[#807b7b] text-2xl my-5" > No posts found </div>
            }

            {(hasPrev || hasNext) && <div className="mt-12">
                <Pagination page={page} hasPrev={hasPrev} hasNext={hasNext} />
            </div>}
        </div>
    );
};

export default AllPosts;
