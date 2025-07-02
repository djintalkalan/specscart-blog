import Comments from "@/components/Comments";
import DeletePostButton from "@/components/DeletePostBtn";
import { callGetApi } from "@/lib/api";
import { authOptions } from "@/lib/authOptions";
import { renderWithBlocks } from "@/lib/renderWithBlocks";
import type { Post } from "@/models/Post";
import moment from "moment";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";

interface Props {
    params: { slug: string };
};

const getData = async (slug: string): Promise<Post> => {

    const res = await callGetApi(`/api/posts/${slug}`, false);

    if (!res.data?.post) {
        throw new Error("Failed to fetch post");
    }

    return res.data?.post
};

const Post = async ({ params }: any) => {

    const session = await getServerSession(authOptions);

    const { slug } = await params;

    const post = await getData(slug);

    return (
        <div className="flex flex-col gap-10 px-6 md:px-10 xl:px-20 py-10">
            {/* Info Section */}
            <div className="flex flex-col lg:flex-row items-center gap-12">
                {/* Text Content */}
                <div className="flex-1">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 text-gray-900 dark:text-white">
                        {post?.title}
                    </h1>
                    <div className="flex items-center gap-4">
                        {post?.author?.image && (
                            <div className="w-12 h-12 relative rounded-full overflow-hidden">
                                <Image
                                    src={post.author.image}
                                    alt={post.author.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}
                        <div className="flex flex-row">
                            <div className="flex flex-col text-gray-500 dark:text-gray-400 text-sm">
                                <span className="font-medium text-gray-800 dark:text-gray-200">
                                    {post?.author?.name}
                                </span>
                                <span>{moment(post?.createdAt).format("MMM DD, YYYY")}</span>
                            </div>
                            {/* @ts-ignore */}
                            {session?.user?.id == post?.authorId &&
                                <div className="flex" >
                                    <Link
                                        href={`/post/${post.slug}/edit`}
                                        className="self-center px-[6px] md:px-3 py-2 md:py-2 text-xs md:text-sm text-center text-white flex flex-row gap-2 pl-3 pr-4 ml-4 items-center font-medium transition-colors bg-teal-600 hover:bg-teal-700 rounded-md dark:bg-[#391749] dark:hover:bg-blue-600"
                                    >
                                        <Image src={'/pencil.png'} height={16} width={16} className="object-contain mr-1" alt="" />
                                        Edit
                                    </Link>

                                    <DeletePostButton slug={post.slug} />

                                </div>
                            }
                        </div>
                    </div>
                </div>

                {/* Cover Image */}
                {post?.coverImage && (
                    <div className="w-full max-w-[100%] lg:max-w-[33%] h-[350px] relative block">
                        <Image
                            src={post.coverImage}
                            alt={post.title}
                            fill
                            className="object-contain rounded-md"
                        />
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="flex flex-col lg:flex-row gap-12">
                {/* Post Description */}
                <div className="flex-[5] space-y-6">
                    <div
                        className="prose dark:prose-invert prose-lg max-w-none text-gray-800 dark:text-gray-100"
                    >
                        {renderWithBlocks(post?.content)}
                    </div>
                    {/* Comments */}
                    <div className="mt-10">
                        <Comments post={post} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Post;
