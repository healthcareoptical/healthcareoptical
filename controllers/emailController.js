import { Resend } from 'resend';
import dotenv from 'dotenv';

export async function sendEmail(req, res, next) {

    const resend = new Resend(process.env.EMAIL_KEY);
    const subject = req.body.subject;
    const message = req.body.message;

    try {
        resend.emails.send({
            from: 'onboarding@resend.dev',
            to: 'healthcareopticalhk@gmail.com',
            subject: subject,
            html: message
        });
    } catch (error) {
        response.errorMessage = response.errorMessage || "Error Occurs";
        response.errorCode = response.errorCode || 500;
        return next(response);
    }
    
    res.status(200).json({ 'message': 'Email Sent' });
}
