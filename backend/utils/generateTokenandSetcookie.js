import jwt from "jsonwebtoken";

export const generateTokenandSetcookie = ((res, userId) => {
    try {
        const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        })
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            secure: process.env.NODE_ENV === 'production',
            sameSite:'strict'
        })
    } catch (error) {
        console.log("Error: ", error);
        res.status(400).json({ success: false, message: error.message });

    }
})