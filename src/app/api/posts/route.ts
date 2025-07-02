import dbConnect from "@/lib/mongoose";
import { generateUniqueSlug } from "@/lib/utils";
import Post from "@/models/Post"; // your mongoose model
import { Types } from "mongoose";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const user = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

        if (!user || !user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { title, content, coverImage } = await req.json();
        if (!title || !content) {
            return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
        }

        await dbConnect();

        const slug = await generateUniqueSlug(title);

        const newPost = new Post({
            title,
            slug,
            content,
            coverImage,
            authorId: user.id,
        });

        await newPost.save();
        return NextResponse.json({ message: "Post created", slug }, { status: 201 });
    } catch (err) {
        console.error("Create post error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export const GET = async (req: Request) => {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1", 10);
        const userId = searchParams.get("userId");

        const POST_PER_PAGE = 2;
        var filter = {} as any
        if (userId) {
            console.log("userId", userId, typeof userId);
            filter.authorId = new Types.ObjectId(userId)
        }


        const posts = await Post.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * POST_PER_PAGE)
            .limit(POST_PER_PAGE)
            .populate("author", "name image")
            .lean();

        // console.log("posts", posts)

        const count = await Post.countDocuments(filter);

        return NextResponse.json({ posts, count }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { message: "Something went wrong!" },
            { status: 500 }
        );
    }
};

