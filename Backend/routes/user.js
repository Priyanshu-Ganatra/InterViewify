import express from 'express';
import { loginUser, logoutUser, signupUser, registerUser, updateUser, allUsers, oneUser } from '../controllers/userController.js';
const router = express.Router();

// login
router.post('/login', loginUser)

// logout
router.post('/logout', logoutUser)

// sign up
router.post('/signup', signupUser)

// user registration 
router.post('/register', registerUser)

// user update 
router.put('/update', updateUser)

// get all users
router.get('/get_all', allUsers)

// get user with id
router.get('/:id', oneUser)

export default router;