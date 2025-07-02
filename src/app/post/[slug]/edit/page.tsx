"use client";

import { callGetApi, callPutApi } from "@/lib/api";
import { Post } from "@/models/Post";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { use, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const EditPostPage = ({ params }: any) => {
    const { slug } = use<{ slug: string }>(params);
    const { data: session, status } = useSession();
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [media, setMedia] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const quillRef = useRef<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await callGetApi(`/api/posts/${slug}`);
                const post = data?.post as Post
                setTitle(post.title);
                setContent(post.content);
                setMedia(post.coverImage || "");
            } catch (error: any) {
                toast.error(error?.response?.data?.error || "Failed to fetch post");
            }
        };

        fetchData();
    }, [slug]);

    useEffect(() => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setMedia(reader.result as string);
            reader.readAsDataURL(file);
        }
    }, [file]);

    const handleUpdate = async () => {
        try {

            const payload = {
                title,
                content,
                coverImage: media,
            }

            console.log("payload", payload)

            const { data } = await callPutApi(`/api/posts/${slug}`, payload);

            toast.success("Post updated!");
            router.push(`/post/${data.slug}`);
        } catch (error: any) {
            toast.error(error?.response?.data?.error || "Update failed");
        }
    };

    const modules = {
        toolbar: {
            container: [
                ["bold", "italic", "underline"],
                ["blockquote", "code-block"],
                [{ header: [1, 2, 3, false] }],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link", "image"],
                ["clean"],
            ],
            handlers: {
                image: () => {
                    const input = document.createElement("input");
                    input.setAttribute("type", "file");
                    input.setAttribute("accept", "image/*");
                    input.click();

                    input.onchange = () => {
                        const file = input.files?.[0];
                        if (file) {
                            const reader = new FileReader();
                            reader.onload = () => {
                                const editor = quillRef.current?.getEditor();
                                const range = editor?.getSelection();
                                if (range) {
                                    editor.insertEmbed(range.index, "image", reader.result);
                                    editor.setSelection(range.index + 1);
                                }
                            };
                            reader.readAsDataURL(file);
                        }
                    };
                },
            },
        },
    };

    if (status === "loading") return <div className="text-center py-10">Loading...</div>;
    if (status === "unauthenticated") {
        router.push("/");
        return null;
    }

    return (
        <div className="relative flex flex-col p-7 space-y-8">
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="py-4 text-6xl border-none outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-400"
            />

            {/* Cover Image Upload */}
            <div className="flex flex-col space-y-3">
                <div className="flex items-center gap-4">
                    {!media && (
                        <label htmlFor="image" className="cursor-pointer flex items-center gap-2">
                            <button
                                className="w-9 h-9 rounded-full border border-gray-900 dark:border-white flex items-center justify-center"
                            >
                                <img src="/plus.png" alt="Add" className="w-4 h-4" />
                            </button>
                            <span className="text-gray-800 dark:text-gray-200 text-sm">Add Cover Image</span>
                        </label>
                    )}
                </div>

                {media && (
                    <div className="relative w-fit">
                        <div className="flex flex-row">
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">Cover Image</p>
                            <button
                                onClick={() => {
                                    setMedia("");
                                    setFile(null);
                                }}
                                className="text-sm text-red-600 hover:underline mb-2 ml-2"
                            >
                                Remove
                            </button>
                        </div>
                        <img
                            src={media}
                            alt="Cover preview"
                            className="max-h-[80px] w-full h-auto rounded-md border border-gray-200 dark:border-gray-700 object-cover"
                        />
                    </div>
                )}

                <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="hidden"
                />
            </div>

            {/* Editor */}
            <ReactQuill
                //@ts-ignore
                ref={quillRef}
                theme="snow"
                value={content}
                onChange={setContent}
                placeholder="Edit your content here..."
                modules={modules}
                className="quill-custom"
            />

            <div className="relative flex justify-end pt-4">
                <button
                    onClick={handleUpdate}
                    className="px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all text-sm sm:text-base"
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default EditPostPage;
