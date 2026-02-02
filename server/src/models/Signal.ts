import mongoose, { Schema, Document } from 'mongoose';

export type SignalType = 'affiliation' | 'credibility' | 'incentive';

export interface ISignal extends Document {
  contentIds: mongoose.Types.ObjectId[];
  creatorId: mongoose.Types.ObjectId;
  type: SignalType;
  data: any; // Mixed JSON results from AI
  reasoning: string;
  createdAt: Date;
  updatedAt: Date;
}

const SignalSchema = new Schema<ISignal>(
  {
    contentIds: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'Content',
      required: true
    }],
    creatorId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Creator', 
      required: true,
      index: true
    },
    type: { 
      type: String, 
      enum: ['affiliation', 'credibility', 'incentive'], 
      required: true,
      index: true
    },
    data: { 
      type: Schema.Types.Mixed, 
      required: true 
    },
    reasoning: { 
      type: String, 
      required: true 
    },
  },
  { timestamps: true }
);

export const Signal = mongoose.model<ISignal>('Signal', SignalSchema);
