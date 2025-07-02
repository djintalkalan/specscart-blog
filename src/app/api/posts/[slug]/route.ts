import dbConnect from "@/lib/mongoose";
import Post from "@/models/Post"; // your mongoose model
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {

        const slug = req?.url.split("/").pop();

        await dbConnect();

        const post = await Post.findOne({ slug }).populate('author', 'name image');

        return NextResponse.json({ message: "Post fetched", post }, { status: 200 });
    } catch (err) {
        console.error("Create post error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}


export async function PUT(req: NextRequest) {
    try {
        const user = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

        const slug = req?.url.split("/").pop();

        if (!user || !user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { title, content, coverImage } = await req.json();
        if (!title || !content) {
            return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
        }

        console.log("content", content)

        await dbConnect();

        const post = await Post.findOne({ slug });

        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        const updatedPost = await Post.updateOne({ slug }, {
            title,
            content,
            coverImage,
        })

        return NextResponse.json({ message: "Post created", slug }, { status: 201 });
    } catch (err) {
        console.error("Create post error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const user = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

        const slug = req?.url.split("/").pop();

        if (!user || !user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        await Post.deleteOne({ slug });

        return NextResponse.json({ message: "Post created", success: true }, { status: 200 });

    } catch (err) {
        console.error("Create post error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
