import transporter from "../config/mail.config.js";

export const sendOtpEmail = async (email, otp) => {
  const fromEmail = process.env.EMAIL_USER || process.env.MAIL_USER;

  await transporter.sendMail({
    from: fromEmail,

    to: email,

    subject: "NGSkillForge OTP Verification",

    html: `
      <h2>Your OTP Code</h2>
      <h1>${otp}</h1>
      <p>OTP expires in 5 minutes.</p>
    `,
  });
};