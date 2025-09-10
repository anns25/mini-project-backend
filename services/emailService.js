import transporter from '../config/emailConfig.js';
import { loadTemplate } from '../config/emailTemplates.js';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3001';
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';


export const sendWelcomeEmail = async (userEmail, username) => {
    try {
        const template = loadTemplate('welcome');
        const html = template({
            username: username,
            siteUrl: FRONTEND_URL
        });

        const mailOptions = {
            from: process.env.FROM_EMAIL || '"The Book Nook" <noreply@booknook.com>',
            to: userEmail,
            subject: 'Welcome to The Book Nook! ��',
            html: html,
            text: `Welcome to The Book Nook!\n\nHello ${username}!\n\nThank you for joining our community of book lovers! We're excited to have you on board.`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Welcome email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };

    } catch (error) {
        console.error('Error sending welcome email:', error);
        return { success: false, error: error.message };
    }
};

export const sendMonthlyReminderEmail = async (userEmail, username) => {
    try {
        const template = loadTemplate('monthly-reminder');

        const html = template({
            username: username,
            siteUrl: FRONTEND_URL,
        });

        const mailOptions = {
            from: process.env.FROM_EMAIL || '"The Book Nook" <noreply@booknook.com>',
            to: userEmail,
            subject: '📚 Monthly Book Nook Reminder - Your Reading Adventure Awaits!',
            html: html,
            text: `Monthly Book Nook Reminder\n\nHello ${username}!\n\nIt's been a while since we've seen you at The Book Nook! We miss your presence in our community of book lovers.`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Monthly reminder email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };

    } catch (error) {
        console.error('Error sending monthly reminder email:', error);
        return { success: false, error: error.message };
    }
};

export const sendOrderConfirmationEmail = async (userEmail, username, orderData) => {
    try {
        const template = loadTemplate('order-confirmation');
        const html = template({
            username: username,
            orderId: orderData.orderId,
            orderDate: orderData.orderDate,
            paymentMethod: orderData.paymentMethod,
            shippingAddress: orderData.shippingAddress,
            books: orderData.books,
            totalAmount: orderData.totalAmount,
            siteUrl: BACKEND_URL
        });

        const mailOptions = {
            from: process.env.FROM_EMAIL || '"The Book Nook" <noreply@booknook.com>',
            to: userEmail,
            subject: '✅ Order Confirmed - The Book Nook',
            html: html,
            text: `Order Confirmed!\n\nHello ${username}!\n\nThank you for your order! We're excited to get your books ready for you.\n\nOrder ID: ${orderData.orderId}`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Order confirmation email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };

    } catch (error) {
        console.error('Error sending order confirmation email:', error);
        return { success: false, error: error.message };
    }
};