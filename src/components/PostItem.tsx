import { removeBlockContent } from "@/lib/renderWithBlocks";
import type { Post } from "@/models/Post";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import DeletePostButton from "./DeletePostBtn";

const PostItem: React.FC<{ item: Post, userId?: string }> = ({ item, userId }) => {

    return (
        <div className="mb-12 flex items-center gap-12 bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm dark:shadow-md max-xl:flex-col max-xl:items-start">
            {/* Image Section */}
            {item.coverImage && (
                <div className="w-[250px] h-[250px] relative rounded overflow-hidden self-center">
                    <Image
                        src={item.coverImage}
                        alt={item.title}
                        fill
                        className="object-cover"
                    />
                </div>
            )}

            {/* Text Section */}
            <div className="flex-1 flex flex-col gap-6">
                {/* Date and Category */}

                <div className="flex flex-row items-center justify-between" >
                    <div className="text-gray-500 dark:text-gray-400 text-sm">
                        <span>{moment(item?.createdAt).format("MMM DD, YYYY")}</span>
                    </div>

                    {item?.author && <div className="text-gray-500 dark:text-gray-400 text-sm flex flex-row">
                        Author: <Image alt="" src={item?.author?.image} width={20} height={20} className="ml-2" ></Image> <span className="ml-2" >{item?.author?.name}</span>
                    </div>}
                </div>


                {/* Title */}
                <Link href={`/post/${item.slug}`}>
                    <h1 className="text-2xl font-bold text-black dark:text-white hover:underline transition-colors duration-200">
                        {item.title}
                    </h1>
                </Link>

                {/* Description */}
                <div
                    className="text-base font-light text-gray-700 dark:text-gray-300"
                    dangerouslySetInnerHTML={{ __html: removeBlockContent(item?.content).substring(0, 150) }}
                />

                {/* Read More Link */}

                <div className="flex flex-1 flex-row justify-between">
                    <Link
                        href={`/post/${item.slug}`}
                        className="border-b border-red-600 dark:border-red-400 w-max pb-0.5 text-red-600 dark:text-red-400 hover:opacity-80 transition-opacity duration-200"
                    >
                        Read More
                    </Link>

                    {userId &&
                        <div className="flex" >
                            <Link
                                href={`/post/${item.slug}/edit`}
                                className="self-center px-[6px] md:px-3 py-2 md:py-2 text-xs md:text-sm text-center text-white flex flex-row gap-2 pl-3 pr-4 ml-4 items-center font-medium transition-colors bg-teal-600 hover:bg-teal-700 rounded-md dark:bg-[#391749] dark:hover:bg-blue-600"
                            >
                                <Image src={'/pencil.png'} height={16} width={16} className="object-contain" alt="" />
                                Edit
                            </Link>

                            <DeletePostButton slug={item.slug} />

                        </div>
                    }

                </div>
            </div>
        </div>
    );
};

export default PostItem;
