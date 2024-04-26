import jwt from 'jsonwebtoken';

const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });

    res.cookie("jwt", token, {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
        httpOnly: true, // cookie cannot be accessed or modified in any way by the browser, prevents XSS attacks
        // cookie will only be sent in a first-party context and not be sent along with any cross-site requests preventing CSRF attacks
        sameSite : true,
        secure: process.env.NODE_ENV !== 'development'
    })
}

export default generateTokenAndSetCookie;