import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

import { generateTokenandSetcookie } from "../utils/generateTokenandSetcookie.js";
import { sendForgetPassword, sendVerificationEmail , sendWelcomeEmail } from "../mails/email.js";


export const signup = async (req, res) => {

    const { username, email, password } = req.body;

    try {
        if (!email || !password || !username) {
            throw new Error("Please provide all fields")
        }
        const UserAlreadyExist = await User.findOne({ email });
        if (UserAlreadyExist) {
            return res.status(400).json({ success: false, message: "User already exist" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        const NewUser = new User({
            username,
            email,
            password: hashedPassword,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 //24 hours
        });
        await NewUser.save();

        //jwt 
        generateTokenandSetcookie(res, NewUser._id)

        await sendVerificationEmail(NewUser.email, verificationToken);

        res.status(201).json({
            success: true, message: "User created successfully", user: {
                ...NewUser._doc,
                password: undefined
            }
        })

    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
}


export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }
        //jwt
        generateTokenandSetcookie(res, user._id)
        user.lastLogin = new Date()
        await user.save();
        res.status(200).json({
            success: true, message: "Logged in successfully", user: {
                ...user._doc,
                password: undefined
            }
        })

    } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, message: error.message })
    }
}


export const logout = async (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ success: true, message: "Logged out successfully" });
}


export const verifyEmail = async (req, res) => {
    const { code } = req.body;
    try {
        const user = await User.findOne({ verificationToken: code, verificationTokenExpiresAt: { $gt: Date.now() } });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();
        await sendWelcomeEmail(user.email, user.username);
        res.status(200).json({
            success: true, message: "Email verified successfully", user: {
                ...user._doc,
                password: undefined
            }
        });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
}

export const ForgetPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        //generate reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resettokenexpiresat = Date.now() + 1 * 60 * 60 * 1000; // 1 hr

        user.resetPasswordToken = resetToken;
        user.resetPasswordTokenExpiresAt = resettokenexpiresat;

        await user.save();
        //send email
        await sendForgetPassword(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);
        res.status(200).json({ success: true, message: "Reset password link sent to your email" });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ success: false, message: error.message })
    }

}

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params
        const { password } = req.body;
        const user = await User.findOne({ resetPasswordToken: token, resetPasswordTokenExpiresAt: { $gt: Date.now() } });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired token" })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpiresAt = undefined;
        await user.save();

        await SendResetPassSuccess(user.email);
    } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, message: error.message })
    }
}

export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" })
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, message: error.message })
    }
}