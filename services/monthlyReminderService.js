import cron from 'node-cron';
import User from '../models/User.js';
import { sendMonthlyReminderEmail } from './emailService.js';

class MonthlyReminderService {
    constructor() {
        this.isRunning = false;
    }

    // Calculate the next run date
    calculateNextRun() {
        const now = new Date();
        let nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1, 9, 0, 0);

        //If we are past the 1st of this month, schedule for next month
        if (now.getDate() >1 || (now.getDate() === 1 && now.getHours() >= 9)) {
            nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1, 9, 0, 0);
        }
        else {
            //Schedule for 1st of current month if we haven't passed 9 am yet
            nextMonth = new Date(now.getFullYear(), now.getMonth(), 1, 9, 0, 0);
        }
        this.nextScheduledRun = nextMonth;
    }

    // Start the cron job
    start() {
        if (this.isRunning) {
            console.log('Monthly reminder service is already running');
            return;
        }

        //Calculate the next run date
        this.calculateNextRun();

        // Schedule job to run on the 1st of every month at 9:00 AM
        this.job = cron.schedule('0 9 1 * *', async () => {
            console.log('Running monthly reminder job...');
            await this.sendMonthlyReminders();
        }, {
            scheduled: true,
            timezone: "UTC" // You can change this to your preferred timezone
        });

        this.isRunning = true;
        console.log('Monthly reminder service started successfully');
        console.log(`Next scheduled run: ${this.nextScheduledRun}`);
    }

    // Stop the cron job
    stop() {
        if (this.job) {
            this.job.stop();
            this.isRunning = false;
            console.log('Monthly reminder service stopped');
        }
    }

    // Send monthly reminders to all users
    async sendMonthlyReminders() {
        try {
            console.log('Fetching users for monthly reminders...');
            
            // Get all users with email addresses
            const users = await User.find({ email: { $exists: true, $ne: '' } });
            
            console.log(`Found ${users.length} users to send reminders to`);
            
            let successCount = 0;
            let errorCount = 0;

            // Send reminders to each user
            for (const user of users) {
                try {
                    const result = await sendMonthlyReminderEmail(user.email, user.username);
                    if (result.success) {
                        successCount++;
                        console.log(`Monthly reminder sent to ${user.email}`);
                    } else {
                        errorCount++;
                        console.error(`Failed to send reminder to ${user.email}:`, result.error);
                    }
                } catch (error) {
                    errorCount++;
                    console.error(`Error sending reminder to ${user.email}:`, error.message);
                }

                // Add a small delay to avoid overwhelming the email server
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            console.log(`Monthly reminder job completed. Success: ${successCount}, Errors: ${errorCount}`);
            
        } catch (error) {
            console.error('Error in monthly reminder job:', error);
        }
    }

    // Manual trigger for testing
    async triggerManualReminder() {
        console.log('Manually triggering monthly reminder...');
        await this.sendMonthlyReminders();
    }

    // Get service status
    getStatus() {
        return {
            isRunning: this.isRunning,
            lastRun: this.lastRun ? this.lastRun.toISOString() : null,
            nextScheduledRun: this.nextScheduledRun ? this.nextScheduledRun.toISOString : null,
            cronExpression: '0 9 1 * *',
            timezone: "UTC"
        };
    }
}

export default new MonthlyReminderService();