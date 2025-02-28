import AgentResponse from '../models/AgentResponse.js';

/**
 * Saves an agent's response to the database
 * @param {Object} req - 
 * @param {Object} res - 
 */
export const saveAgentResponse = async (req, res) => {
  try {

    const { response } = req.body;

    if (!response) {
      return res.status(400).json({ 
        error: 'Response is required' 
      });
    }

    const newAgentResponse = new AgentResponse({ 
      response 
    });

    const savedResponse = await newAgentResponse.save();

    res.status(201).json({
      message: 'Response saved successfully',
      data: savedResponse
    });

  } catch (error) {

    console.error('Error saving response:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message 
    });
  }
};