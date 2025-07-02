import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
    const { name, email, password, image } = await req.json();

    await dbConnect();
    const existing = await User.findOne({ email });
    if (existing) {
        await User.deleteOne({ email });
    }

    if (image && !/^data:image\/(png|jpeg|jpg|webp);base64,/.test(image)) {
        return new Response("Invalid image format", { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, image, email, password: hashed });

    return new Response(JSON.stringify({ id: user._id }), { status: 201 });
}
