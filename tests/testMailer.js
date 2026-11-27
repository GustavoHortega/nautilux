require('dotenv').config();

const { sendEmail } = require('../services/email');

const testMailer = async () => {
    try {
        const result = await sendEmail({
            to: process.env.SMTP_FROM,
            subject: 'Nautilux - SMTP Test',
            text: 'SMTP integration is working successfully!'
        });

        console.log('Email sent successfully!');
        console.log('Message ID:', result.messageId);

    } catch (error) {
        console.error('Email sending failed:', error.message);
    }
};

testMailer();