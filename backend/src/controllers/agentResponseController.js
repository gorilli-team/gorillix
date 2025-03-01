import AgentResponse from "../models/AgentResponse.js";

/**
 * Saves an agent's response to the database
 * @param {Object} req -
 * @param {Object} res -
 */
export const saveAgentResponse = async (req, res) => {
  try {
    const { response } = req.body;

    console.log("\x1b[38;5;214m", response, "\x1b[0m");

    if (!response) {
      return res.status(400).json({
        error: "Response is required",
      });
    }

    const newAgentResponse = new AgentResponse({
      response,
    });

    const savedResponse = await newAgentResponse.save();

    res.status(201).json({
      message: "Response saved successfully",
      data: savedResponse,
    });
  } catch (error) {
    console.error("Error saving response:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};

/**
 * Retrieves all agent responses from the database
 * @param {Object} req -
 * @param {Object} res -
 */
export const getAllAgentResponses = async (req, res) => {
  try {
    const responses = await AgentResponse.find()
      .select("response createdAt")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Responses retrieved successfully",
      count: responses.length,
      data: responses,
    });
  } catch (error) {
    console.error("Error retrieving responses:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};
