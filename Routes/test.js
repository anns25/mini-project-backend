import { Router } from "express";
import monthlyReminderService from '../services/monthlyReminderService.js';

const test = Router();

// Test route to manually trigger monthly reminder
test.post('/trigger-monthly-reminder', async (req, res) => {
    try {
        await monthlyReminderService.triggerManualReminder();
        res.json({ 
            success: true, 
            message: 'Monthly reminder triggered successfully' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Get cron service status
test.get('/cron-status', (req, res) => {
    const status = monthlyReminderService.getStatus();
    res.json(status);
});

export default test;