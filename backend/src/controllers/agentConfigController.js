import AgentConfig from '../models/AgentConfig.js';

// Get available risk levels (for reference)
export const getRiskLevels = (req, res) => {
  try {
    const riskLevels = [
      { level: 1, id: 'very-conservative', label: 'Very Conservative' },
      { level: 2, id: 'conservative', label: 'Conservative' },
      { level: 3, id: 'moderate', label: 'Moderate' },
      { level: 4, id: 'aggressive', label: 'Aggressive' },
      { level: 5, id: 'degen', label: 'Degen' }
    ];
    
    res.json({ success: true, data: riskLevels });
  } catch (error) {
    console.error('Error retrieving risk levels:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get available trading strategies (for reference)
export const getTradingStrategies = (req, res) => {
  try {
    const tradingStrategies = [
      { id: 'liquidity-management', name: 'LIQUIDITY MANAGEMENT' },
      { id: 'swap', name: 'SWAP' }
    ];
    
    res.json({ success: true, data: tradingStrategies });
  } catch (error) {
    console.error('Error retrieving trading strategies:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Create or update agent configuration
export const createOrUpdateAgentConfig = async (req, res) => {
  try {
    const { walletAddress, tradingStrategy, riskLevel, tkaAllocation, tkbAllocation, isActive } = req.body;
    
    // Basic validation
    if (!walletAddress) {
      return res.status(400).json({ 
        success: false, 
        message: 'Wallet address is required' 
      });
    }
    
    // Check if configuration already exists for this wallet
    const existingConfig = await AgentConfig.findOne({ walletAddress });
    
    if (existingConfig) {
      // Update existing configuration
      const updatedConfig = await AgentConfig.findOneAndUpdate(
        { walletAddress },
        { 
          tradingStrategy,
          riskLevel,
          tkaAllocation,
          tkbAllocation,
          isActive
        },
        { new: true }
      );
      
      return res.json({ 
        success: true, 
        message: 'Agent configuration updated successfully',
        data: updatedConfig
      });
    } else {
      // Create new configuration
      const newConfig = new AgentConfig({
        walletAddress,
        tradingStrategy,
        riskLevel,
        tkaAllocation,
        tkbAllocation,
        isActive
      });
      
      await newConfig.save();
      
      return res.status(201).json({ 
        success: true, 
        message: 'Agent configuration created successfully',
        data: newConfig
      });
    }
  } catch (error) {
    console.error('Error creating/updating agent configuration:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation error',
        errors: error.errors
      });
    }
    
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get agent configuration by wallet address
export const getAgentConfigByWallet = async (req, res) => {
  try {
    const { walletAddress } = req.params;
    
    const config = await AgentConfig.findOne({ walletAddress });
    
    if (!config) {
      return res.status(404).json({ 
        success: false, 
        message: 'No configuration found for this wallet address' 
      });
    }
    
    res.json({ success: true, data: config });
  } catch (error) {
    console.error('Error retrieving agent configuration:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get all agent configurations
export const getAllAgentConfigs = async (req, res) => {
    try {
      const query = {};
      
      if (req.query.isActive !== undefined) {
        query.isActive = req.query.isActive === 'true';
      }

      if (req.query.tradingStrategy) {
        query.tradingStrategy = req.query.tradingStrategy;
      }
      
      if (req.query.riskLevel) {
        query.riskLevel = req.query.riskLevel;
      }
  
      const configs = await AgentConfig.find(query).sort({ createdAt: -1 });
      
      res.json({ 
        success: true, 
        count: configs.length,
        data: configs 
      });
    } catch (error) {
      console.error('Error retrieving agent configurations:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };