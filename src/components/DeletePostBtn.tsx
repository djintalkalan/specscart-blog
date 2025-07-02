"use client";

import { callDeleteApi } from "@/lib/api";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

type Props = {
    slug: string;
};

export default function DeletePostButton({ slug }: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        try {
            setLoading(true);
            const res = await callDeleteApi(`/api/posts/${slug}`);

            if (!res.data?.success) {
                throw new Error("Failed to delete the post");
            }

            toast.success("Post deleted");
            router.replace("/my-posts");
        } catch (err) {
            toast.error("Could not delete the post");
        } finally {
            setLoading(false);
        }
    };

    return (

        <button
            onClick={handleDelete}
            disabled={loading}
            className="self-center px-[6px] md:px-3 py-2 md:py-2 text-xs md:text-sm text-center text-white flex flex-row gap-2 pl-3 pr-4 ml-4 items-center font-medium transition-colors bg-red-700 hover:bg-red-800 rounded-md dark:bg-red-900 dark:hover:bg-red-950"
        >
            <Image src={'/delete.png'} height={16} width={16} className="object-contain mr-1" alt="" />
            {loading ? "Deleting..." : "Delete"}
        </button>
    );
}
