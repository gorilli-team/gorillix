import mongoose from 'mongoose';

const AgentConfigSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  tradingStrategy: {
    type: String,
    required: true,
    enum: ['liquidity-management', 'swap']
  },
  riskLevel: {
    type: String,
    required: true,
    enum: ['very-conservative', 'conservative', 'moderate', 'aggressive', 'degen']
  },
  tkaAllocation: {
    type: Number,
    required: true,
    min: 0
  },
  tkbAllocation: {
    type: Number,
    required: true,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to update the updatedAt timestamp
AgentConfigSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const AgentConfig = mongoose.model('AgentConfig', AgentConfigSchema);

export default AgentConfig;