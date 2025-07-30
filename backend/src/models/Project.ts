import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  name: string;
  description: string;
  type: 'analytics' | 'development' | 'finance' | 'marketing' | 'other';
  status: 'active' | 'archived' | 'draft';
  members: string[];
  owner: string;
  queries: number;
  isStarred: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastModified: Date;
  settings: {
    isPublic: boolean;
    allowComments: boolean;
    autoBackup: boolean;
  };
  tags: string[];
}

const ProjectSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  type: {
    type: String,
    enum: ['analytics', 'development', 'finance', 'marketing', 'other'],
    default: 'other'
  },
  status: {
    type: String,
    enum: ['active', 'archived', 'draft'],
    default: 'active'
  },
  members: [{
    type: String,
    trim: true
  }],
  owner: {
    type: String,
    required: true,
    trim: true
  },
  queries: {
    type: Number,
    default: 0
  },
  isStarred: {
    type: Boolean,
    default: false
  },
  settings: {
    isPublic: {
      type: Boolean,
      default: false
    },
    allowComments: {
      type: Boolean,
      default: true
    },
    autoBackup: {
      type: Boolean,
      default: true
    }
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Update lastModified on save
ProjectSchema.pre('save', function(next) {
  this.lastModified = new Date();
  next();
});

// Index for better query performance
ProjectSchema.index({ owner: 1, status: 1 });
ProjectSchema.index({ type: 1, status: 1 });
ProjectSchema.index({ isStarred: 1, owner: 1 });

export default mongoose.model<IProject>('Project', ProjectSchema); 