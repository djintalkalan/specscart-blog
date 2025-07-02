import dbConnect from "@/lib/mongoose";
import Comment from "@/models/Comment";
import User from "@/models/User";
import { Types } from "mongoose";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    await dbConnect();


    const postId = req.nextUrl.searchParams.get("id");


    try {
        const comments = await Comment.find({ postId: postId })
            .populate("user", "name image")
        //   .sort({ createdAt: -1 });

        return NextResponse.json({ comments }, { status: 200 });
    } catch (err) {
        console.error("GET /comments error:", err);
        return NextResponse.json(
            { message: "Something went wrong while fetching comments." },
            { status: 500 }
        );
    }
};

export const POST = async (req: NextRequest) => {
    await dbConnect();

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || !token.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();

        const user = await User.findOne({ _id: token?.id });
        if (!user) {
            return NextResponse.json({ message: "User not found!" }, { status: 404 });
        }

        if (!body.text || !body.postId) {
            return NextResponse.json(
                { message: "Text and postId are required." },
                { status: 400 }
            );
        }

        const newComment = await Comment.create({
            text: body.text,
            postId: new Types.ObjectId(body.postId as string),
            userId: user._id,
        });

        const populated = await newComment.populate("user", "name image");

        return NextResponse.json(populated, { status: 200 });
    } catch (err) {
        console.error("POST /comments error:", err);
        return NextResponse.json(
            { message: "Something went wrong while creating comment." },
            { status: 500 }
        );
    }
};
