import express from 'express';
import mongoose from 'mongoose';
import * as agentConfigController from '../controllers/agentConfigController.js';

const router = express.Router();

// Database status route
router.get('/db-status', (req, res) => {
    try {
        const dbStatus = mongoose.connection.readyState === 1;
        res.json({
            connected: dbStatus,
            message: dbStatus ? 'Database connected' : 'Database not connected'
        });
    } catch (error) {
        res.status(500).json({ error: 'Error checking database status' });
    }
});

// Agent Configuration routes
router.get('/api/agent/risk-levels', agentConfigController.getRiskLevels);
router.get('/api/agent/trading-strategies', agentConfigController.getTradingStrategies);
router.post('/api/agent/config', agentConfigController.createOrUpdateAgentConfig);
router.get('/api/agent/config/:walletAddress', agentConfigController.getAgentConfigByWallet);
router.get('/api/agent/configs', agentConfigController.getAllAgentConfigs);

export default router;