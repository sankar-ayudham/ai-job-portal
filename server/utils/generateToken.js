import jwt from 'jsonwebtoken';

export const generateTokensAndSetCookies = (userId, res) => {
    // 1. Create Tokens
    const accessToken = jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: process.env.JWT_ACCESS_EXPIRE
    });

    const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRE
    });

    // 2. Set Secure Cookies
    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('accessToken', accessToken, {
        httpOnly: true, // Prevents frontend JavaScript from reading the cookie (prevents XSS)
        secure: isProduction, // HTTPS only in production
        sameSite: 'strict', // Prevents cross-site request forgery (CSRF)
        maxAge: 15 * 60 * 1000 // 15 minutes in milliseconds
    });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    });
};