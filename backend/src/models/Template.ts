import mongoose, { Schema, Document } from 'mongoose';

export interface ITemplate extends Document {
  name: string;
  description: string;
  category: 'analytics' | 'finance' | 'marketing' | 'development' | 'other';
  query: string;
  queryType: 'sql' | 'mongodb';
  isPublic: boolean;
  author: string;
  usage: number;
  rating: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  lastUsed: Date;
  settings: {
    allowComments: boolean;
    allowForking: boolean;
    requireApproval: boolean;
  };
}

const TemplateSchema: Schema = new Schema({
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
  category: {
    type: String,
    enum: ['analytics', 'finance', 'marketing', 'development', 'other'],
    default: 'other'
  },
  query: {
    type: String,
    required: true,
    trim: true
  },
  queryType: {
    type: String,
    enum: ['sql', 'mongodb'],
    required: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  usage: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  tags: [{
    type: String,
    trim: true
  }],
  settings: {
    allowComments: {
      type: Boolean,
      default: true
    },
    allowForking: {
      type: Boolean,
      default: true
    },
    requireApproval: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

// Update lastUsed on usage increment
TemplateSchema.methods.incrementUsage = function() {
  this.usage += 1;
  this.lastUsed = new Date();
  return this.save();
};

// Calculate average rating
// TemplateSchema.methods.updateRating = function(newRating) {
//   // Simple average calculation - in production you might want more sophisticated rating system
//   this.rating = newRating;
//   return this.save();
// };

// Index for better query performance
TemplateSchema.index({ author: 1, isPublic: 1 });
TemplateSchema.index({ category: 1, isPublic: 1 });
TemplateSchema.index({ queryType: 1, isPublic: 1 });
TemplateSchema.index({ tags: 1 });
TemplateSchema.index({ usage: -1 });
TemplateSchema.index({ rating: -1 });

export default mongoose.model<ITemplate>('Template', TemplateSchema); 