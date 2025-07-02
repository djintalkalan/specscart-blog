import mongoose, {
    Document,
    Model,
    models,
    ObjectId,
    Schema
} from 'mongoose';
import { Post } from './Post';
import type { User } from './User';

export interface Comment {
    _id: ObjectId;
    text: string;
    postId: ObjectId;
    userId: ObjectId;
    createdAt: Date;
    // Optional virtual field
    user?: User;
    post?: Post;
}

type IComment = Comment & Document;

const CommentSchema: Schema<IComment> = new Schema(
    {
        text: { type: String, required: true },
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
        createdAt: { type: Date, default: Date.now },
    },
    {
        toObject: { virtuals: true },
        toJSON: { virtuals: true },
    }
);

CommentSchema.virtual('user', {
    ref: 'User',
    localField: 'userId',
    foreignField: '_id',
    justOne: true,
});

const Comment: Model<IComment> = models.Comment || mongoose.model<IComment>('Comment', CommentSchema);
export default Comment;
