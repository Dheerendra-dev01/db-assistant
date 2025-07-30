import mongoose, { Schema, Document } from 'mongoose';

export interface ITeamMember {
  name: string;
  email: string;
  role: string;
  status: 'online' | 'offline' | 'away';
  avatar?: string;
  lastActive?: Date;
}

export interface ITeam extends Document {
  name: string;
  description: string;
  owner: string;
  members: ITeamMember[];
  createdAt: Date;
  updatedAt: Date;
}

const TeamMemberSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, required: true },
  status: { type: String, enum: ['online', 'offline', 'away'], default: 'offline' },
  avatar: { type: String },
  lastActive: { type: Date }
}, { _id: false });

const TeamSchema: Schema = new Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, trim: true, maxlength: 500 },
  owner: { type: String, required: true, trim: true },
  members: { type: [TeamMemberSchema], default: [] }
}, { timestamps: true });

TeamSchema.index({ owner: 1 });
TeamSchema.index({ 'members.email': 1 });

export default mongoose.model<ITeam>('Team', TeamSchema);