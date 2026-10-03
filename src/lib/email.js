import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendInquiryEmail({ to, ownerName, senderName, propertyTitle, message }) {
  try {
    await resend.emails.send({
      from: "HomeHive <onboarding@resend.dev>",
      to,
      subject: `New inquiry about "${propertyTitle}"`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px;">
          <h2>Hi ${ownerName},</h2>
          <p><strong>${senderName}</strong> sent you a message about your property
          <strong>${propertyTitle}</strong>:</p>
          <p style="background:#f1f5f9; padding:12px; border-radius:8px;">${message}</p>
          <p>Log in to HomeHive to reply.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Email failed to send:", error.message);
  }
}

export async function sendPasswordResetEmail({ to, name, resetLink }) {
  try {
    await resend.emails.send({
      from: "HomeHive <onboarding@resend.dev>",
      to,
      subject: "Reset your HomeHive password",
      html: `
        <div style="font-family: sans-serif; max-width: 480px;">
          <h2>Hi ${name},</h2>
          <p>We received a request to reset your password. Click the button below:</p>
          <p>
            <a href="${resetLink}" style="background:#2563eb; color:#fff; padding:10px 20px; border-radius:8px; text-decoration:none; display:inline-block;">
              Reset Password
            </a>
          </p>
          <p>This link expires in 1 hour. If you didn't request this, ignore this email.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Email failed to send:", error.message);
  }
}