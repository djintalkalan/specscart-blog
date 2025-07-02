import mongoose, {
    Document,
    Model,
    models,
    ObjectId,
    Schema
} from 'mongoose';
import type { User } from './User';

export interface Post {
    _id: ObjectId;
    title: string;
    slug: string;
    authorId: ObjectId;
    content: string;
    coverImage?: string;
    createdAt: Date;
    // Optional virtual field
    author?: User;
}

type IPost = Post & Document;

const PostSchema: Schema<IPost> = new Schema(
    {
        title: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        content: { type: String, required: true },
        coverImage: { type: String },
        createdAt: { type: Date, default: Date.now },
    },
    {
        toObject: { virtuals: true },
        toJSON: { virtuals: true },
    }
);

// 🔁 Virtual populate: Populate author into `author` field from authorId
PostSchema.virtual('author', {
    ref: 'User',
    localField: 'authorId',
    foreignField: '_id',
    justOne: true,
});

const Post: Model<IPost> = models.Post || mongoose.model<IPost>('Post', PostSchema);
export default Post;
