import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import otpModel from '../models/otpModel.js';
import verifiedEmailModel from '../models/verifiedEmailModel.js';
import transporter from '../config/nodemailer.js';


const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

// Route for user login
const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        // FIX (carried over from before): this condition was inverted.
        if (isMatch) {
            const token = createToken(user._id);
            res.json({ success: true, token })
        }
        else{
            res.json({ success: false, message: "Invalid credentials" })
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}


// NEW: Check whether an email already belongs to a registered user.
// Used by the buyer page's email-first flow to decide whether to show
// a password field (existing user) or kick off OTP verification (new user).
const checkEmail = async (req, res) => {
    try {

        const { email } = req.body;

        if (!email || !validator.isEmail(email)) {
            return res.json({ exists: false, message: "Please enter a valid email" });
        }

        const user = await userModel.findOne({ email });

        res.json({ exists: !!user });

    } catch (error) {
        console.log(error);
        res.json({ exists: false, message: error.message });
    }
}


// NEW: Generate a 6-digit OTP, store it (overwriting any previous one for
// this email), and email it to the user. The stored OTP auto-expires after
// 5 minutes (see otpModel.js).
const sendOtp = async (req, res) => {
    try {

        const { email } = req.body;

        if (!email || !validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        await otpModel.findOneAndUpdate(
            { email },
            { email, otp, createdAt: Date.now() },
            { upsert: true, new: true }
        );

        await transporter.sendMail({
            from: `"KalaSetu" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Your KalaSetu verification code",
            html: `<p>Your KalaSetu verification code is <b>${otp}</b>.</p>
                   <p>This code expires in 5 minutes. If you didn't request this, you can ignore this email.</p>`,
        });

        res.json({ success: true, message: "OTP sent" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}


// NEW: Verify a submitted OTP against the stored one. On success, the OTP
// is consumed (deleted) and the email is marked "verified" for a short
// window so registerUser can confirm this step actually happened.
const verifyOtp = async (req, res) => {
    try {

        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.json({ valid: false, message: "Email and code are required" });
        }

        const record = await otpModel.findOne({ email });

        if (!record) {
            return res.json({ valid: false, message: "Code expired or not found. Please request a new one." });
        }

        if (record.otp !== otp) {
            return res.json({ valid: false, message: "Incorrect code." });
        }

        // Correct — consume it so it can't be reused.
        await otpModel.deleteOne({ email });

        await verifiedEmailModel.findOneAndUpdate(
            { email },
            { email, verifiedAt: Date.now() },
            { upsert: true, new: true }
        );

        res.json({ valid: true });

    } catch (error) {
        console.log(error);
        res.json({ valid: false, message: error.message });
    }
}


// Route for user registration
const registerUser = async (req, res) => {
    try {

        const { name, email, password, newsletter } = req.body;

        // check if user already exists
        const exists = await userModel.findOne({ email });

        if (exists) {
            return res.json({ success: false, message: "User already exists" })
        }

        // validating email format and strong password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "please enter a valid email" })
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "please enter a strong password" })
        }

        // NEW: require that this email passed OTP verification first.
        // Without this, anyone could call this endpoint directly and skip
        // the OTP step entirely.
        const verified = await verifiedEmailModel.findOne({ email });

        if (!verified) {
            return res.json({ success: false, message: "Please verify your email with the code we sent before creating an account." });
        }

        // hashing the password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            // NEW: the buyer flow's email-first signup never collects a
            // separate "name" field, so fall back to the email's local
            // part rather than failing the required-field validation.
            name: name || email.split('@')[0],
            email,
            password: hashedPassword,
            newsletter: !!newsletter,
        })

        const user = await newUser.save();

        // Consume the verification flag now that the account exists.
        await verifiedEmailModel.deleteOne({ email });

        const token = createToken(user._id);

        res.json({ success: true, token })


    } catch (error) {
        console.log(error);
        res.json({ success: false, message:error.message })
    }

}

//Route for admin login
const adminLogin = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email+password, process.env.JWT_SECRET);
            res.json({ success: true, token })
        } else{
            res.json({ success: false, message: "Invalid credentials" })
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message:error.message })
    }

}


export { loginUser, registerUser, adminLogin, checkEmail, sendOtp, verifyOtp };
