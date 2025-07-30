import mongoose, { Schema, Document } from 'mongoose';

export interface IActivity extends Document {
  type: 'query' | 'project' | 'template' | 'team' | 'system' | 'user';
  title: string;
  description: string;
  user: string;
  project?: string;
  template?: string;
  team?: string;
  metadata?: any;
  timestamp: Date;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
}

const ActivitySchema: Schema = new Schema({
  type: {
    type: String,
    enum: ['query', 'project', 'template', 'team', 'system', 'user'],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  user: {
    type: String,
    required: true,
    trim: true
  },
  project: {
    type: String,
    trim: true
  },
  template: {
    type: String,
    trim: true
  },
  team: {
    type: String,
    trim: true
  },
  metadata: {
    type: Schema.Types.Mixed
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  isRead: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  }
}, {
  timestamps: true
});

// Index for better query performance
ActivitySchema.index({ user: 1, timestamp: -1 });
ActivitySchema.index({ type: 1, timestamp: -1 });
ActivitySchema.index({ isRead: 1, user: 1 });
ActivitySchema.index({ project: 1, timestamp: -1 });

export default mongoose.model<IActivity>('Activity', ActivitySchema); 