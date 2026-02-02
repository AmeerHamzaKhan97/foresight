import mongoose, { Schema, Document } from 'mongoose';

export interface IContent extends Document {
  creatorId: mongoose.Types.ObjectId;
  platform: 'twitter';
  platformId: string; // Tweet ID
  text: string;
  metadata: {
    retweets?: number;
    likes?: number;
    postedAt?: Date;
  };
  analyzed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ContentSchema = new Schema<IContent>(
  {
    creatorId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Creator', 
      required: true,
      index: true
    },
    platform: { 
      type: String, 
      enum: ['twitter'], 
      default: 'twitter' 
    },
    platformId: { 
      type: String, 
      required: true, 
      unique: true,
      index: true
    },
    text: { 
      type: String, 
      required: true 
    },
    metadata: {
      retweets: Number,
      likes: Number,
      postedAt: Date,
    },
    analyzed: { 
      type: Boolean, 
      default: false,
      index: true
    },
  },
  { timestamps: true }
);

export const Content = mongoose.model<IContent>('Content', ContentSchema);
