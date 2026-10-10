import mongoose from 'mongoose';

/*
  One document per email awaiting verification. `expires: 300` creates a
  TTL index on createdAt — MongoDB automatically deletes the document
  ~5 minutes after it's created, so codes can't be verified late and
  nothing needs manual cleanup.
*/
const otpSchema = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 300 },
});

const otpModel = mongoose.models.otp || mongoose.model('otp', otpSchema);

export default otpModel;
