import mongoose, { Schema, Document } from 'mongoose';

export type CreatorStatus = 'PENDING' | 'ACTIVE' | 'ERROR';

export interface ICreator extends Document {
  handle: string;
  platform: 'twitter';
  status: CreatorStatus;
  displayName?: string;
  profileImage?: string;
  metadata: {
    followersCount?: number;
    description?: string;
  };
  lastIngestedAt?: Date;
  affiliationScore?: number;
  credibilityScore?: number;
  createdAt: Date;
  updatedAt: Date;
}

const CreatorSchema = new Schema<ICreator>(
  {
    handle: { 
      type: String, 
      required: true, 
      unique: true, 
      index: true,
      lowercase: true,
      trim: true
    },
    platform: { 
      type: String, 
      enum: ['twitter'], 
      default: 'twitter' 
    },
    status: { 
      type: String, 
      enum: ['PENDING', 'ACTIVE', 'ERROR'], 
      default: 'PENDING' 
    },
    displayName: String,
    profileImage: String,
    metadata: {
      followersCount: Number,
      description: String,
    },
    lastIngestedAt: Date,
    affiliationScore: { type: Number, min: 0, max: 100 },
    credibilityScore: { type: Number, min: 0, max: 100 },
  },
  { timestamps: true }
);

export const Creator = mongoose.model<ICreator>('Creator', CreatorSchema);
