import mongoose, { Document, Model, ObjectId, Schema } from "mongoose";

export interface User {
    _id: ObjectId,
    name: string;
    email: string;
    image: string;
    password: string;
    createdAt?: Date;
}

type IUser = User & Document;

const UserSchema = new Schema<IUser>({
    name: String,
    email: { type: String, unique: true },
    password: String,
    image: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now }
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;
