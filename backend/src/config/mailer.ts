import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create a transporter using Gmail SMTP
export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER || 'YOUR_GMAIL_ADDRESS',
    pass: process.env.GMAIL_APP_PASSWORD || 'YOUR_APP_PASSWORD',
  },
});

export const sendPasswordResetEmail = async (to: string, token: string) => {
  const resetLink = `http://localhost:5173/auth/reset-password?token=${token}`;
  
  const mailOptions = {
    from: `"NOVAX ERP" <${process.env.GMAIL_USER}>`,
    to,
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #0f172a; text-align: center;">NOVAX Password Reset</h2>
        <p style="color: #334155; font-size: 16px;">
          You are receiving this email because you (or someone else) requested a password reset for your account.
        </p>
        <p style="color: #334155; font-size: 16px;">
          Please click on the following link to complete the process. This link is valid for 1 hour.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p style="color: #64748b; font-size: 14px; text-align: center;">
          If you did not request this, please ignore this email and your password will remain unchanged.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${to}`);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send email');
  }
};
