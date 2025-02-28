import mongoose from 'mongoose';

const AgentResponseSchema = new mongoose.Schema({
  response: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

AgentResponseSchema.index({ createdAt: -1 });

const AgentResponse = mongoose.model('AgentResponse', AgentResponseSchema);

export default AgentResponse;