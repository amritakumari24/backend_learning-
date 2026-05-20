import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
    {
        email: String,
        otp: String,
        expireAt:Date,
    },
    {timestamps: true}
);

// Automatically remove expired OTP documents
otpSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("OTP", otpSchema);