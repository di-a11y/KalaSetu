import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    cartData: {type: Object, default: {}},
    // NEW: the buyer signup form has a "keep me updated" checkbox that
    // registerUser now reads — stored here so it isn't just dropped.
    newsletter: {type: Boolean, default: false},
},{minimize: false})

// FIX (carried over from before): was `mongoose.model.user` — mongoose.model
// is a function, so `.user` on it is always undefined, meaning
// mongoose.model('user', ...) ran on every import. `mongoose.models` (plural)
// is the correct registry to check against nodemon's "OverwriteModelError".
const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;
