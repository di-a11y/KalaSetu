import mongoose from 'mongoose';

/*
  Written once an OTP is successfully verified, so registerUser can
  confirm this email actually passed verification instead of someone
  calling /api/user/register directly and skipping the OTP step.

  `expires: 900` auto-deletes the flag after 15 minutes — enough time
  to finish choosing a password on the next screen, but short enough
  that it can't be reused much later.
*/
const verifiedEmailSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    verifiedAt: { type: Date, default: Date.now, expires: 900 },
});

const verifiedEmailModel = mongoose.models.verifiedEmail || mongoose.model('verifiedEmail', verifiedEmailSchema);

export default verifiedEmailModel;
