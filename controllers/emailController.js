import { Resend } from 'resend';
import dotenv from 'dotenv';

export async function sendEmail(req, res, next) {

    const resend = new Resend(process.env.EMAIL_KEY);
    const subject = req.body.subject;
    const message = req.body.message;

    try {
        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: 'healthcareopticalhk@gmail.com',
            subject: subject,
            html: message
        });

        if (error){
            res.errorMessage = error.message;
            res.errorCode = error.statusCode;
            throw new Error('');
        }
    } catch (error) {
        const response = {};
        response.errorMessage = res.errorMessage || "Error Occurs";
        response.errorCode = res.errorCode || 500;
        return next(response);
    }
    
    res.status(200).json({ 'message': 'Email Sent' });
}
