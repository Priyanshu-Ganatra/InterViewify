import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized - no token provided' })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (!decoded) {
            return res.status(401).json({ message: 'Unauthorized - token verification failed' })
        }

        const user = await User.findById(decoded.id).select('-password')

        if(!user)  {
            return res.status(404).json({ message: 'User not found' })
        }

        req.user = user
        next()

    } catch (error) {
        res.status(500).json(error.message)
    }
}

export default protectRoute;