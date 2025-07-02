"use client";

import { callPostApi } from "@/lib/api";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import "react-quill-new/dist/quill.snow.css";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const CreatePost = () => {
    const { status } = useSession();
    const router = useRouter();

    const [file, setFile] = useState<File | null>(null);
    const [media, setMedia] = useState<string>("");
    const [value, setValue] = useState<string>("");
    const [title, setTitle] = useState<string>("");

    const quillRef = useRef<any>(null);

    useEffect(() => {
        if (file) {
            const reader = new FileReader();

            reader.onloadend = () => {
                setMedia(reader.result as string); // Base64 string
            };

            reader.readAsDataURL(file);
        }
    }, [file]);


    if (status === "loading") {
        return <div className="text-center py-10 text-lg">Loading...</div>;
    }

    if (status === "unauthenticated") {
        router.push("/");
        return null;
    }

    const slugify = (str: string): string =>
        str
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/[\s_-]+/g, "-")
            .replace(/^-+|-+$/g, "");

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null;
        setFile(selectedFile);
        e.target.value = "";
    };

    const handleSubmit = async () => {

        try {
            const res = await callPostApi('/api/posts', {
                title,
                slug: slugify(title),
                content: value,
                coverImage: media
            })

            if (res.data?.slug) {
                router.push(`/post/${res?.data?.slug}`);
            }
        } catch (error: any) {
            const errorMessage = error?.response?.data?.error || 'Registration failed';
            toast.error(errorMessage)
        }

    };

    const imageHandler = () => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();

        input.onchange = async () => {
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
                image: imageHandler,
            },
        },
    };

    return (
        <div className="relative flex flex-col p-7 space-y-8">
            <input
                type="text"
                placeholder="Title"
                className="py-4 text-6xl border-none outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-400"
                onChange={(e) => setTitle(e.target.value)}
            />

            {/* 📸 Cover Image Section */}
            <div className="flex flex-col space-y-3">
                <div className="flex items-center gap-4">
                    {!media && <label htmlFor="image" className="cursor-pointer flex items-center gap-2">
                        <button
                            className="w-9 h-9 rounded-full border border-gray-900 dark:border-white flex items-center justify-center"
                        >
                            <Image src="/plus.png" alt="add cover" width={16} height={16} />
                        </button>
                        <span className="text-gray-800 dark:text-gray-200 text-sm">Add Cover Image</span>
                    </label>}
                </div>

                {media && (
                    <div className="relative w-fit">
                        <div className="flex flex-row" >
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
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>

            {/* 📝 Editor */}
            <div className="w-full">
                <ReactQuill
                    //@ts-ignore
                    ref={quillRef}
                    theme="snow"
                    value={value}
                    onChange={setValue}
                    placeholder="Enter blog content here"
                    modules={modules}
                    className="quill-custom"
                />
            </div>

            <div className="relative flex flex-col p-7 space-y-8">
                <button
                    onClick={handleSubmit}
                    className="absolute bottom-4 right-4 px-5 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all text-sm sm:text-base"
                >
                    Publish
                </button>
            </div>

        </div>
    );
};

export default CreatePost;
