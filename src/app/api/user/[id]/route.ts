import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {

        const id = req?.url.split("/").pop();

        await dbConnect();

        const user = await User.findOne({ _id: id })

        return NextResponse.json({ message: "userFetched", user }, { status: 200 });
    } catch (err) {
        console.error("Create post error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}