import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import { cloudinaryConnect } from './config/cloudinary.js';

import userRouter from './routes/user.js'
import questionsRouter from './routes/questions.js'
import testsRouter from './routes/tests.js'

dotenv.config();
const PORT = process.env.PORT || 8000
const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/Interviewify'

const app = express()
// Parse incoming requests data 
app.use(express.json())
app.use(cookieParser()); // to parse incoming requests with cookies
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
})) // to parse incoming requests with files
cloudinaryConnect(); // connect to cloudinary

// middleware for handling CORS Policy
// Allow all origins with default of cors(*)
app.use(cors())

app.use('/api/user', userRouter)
app.use('/api/questions', questionsRouter)
app.use('/api/tests', testsRouter)

    ; (
        async () => {
            try {
                await mongoose.connect(DATABASE_URL)
                console.log('Connected to MongoDB')
                app.listen(PORT, () => {
                    console.log(`Server is running on port ${PORT}`)
                });
            } catch (error) {
                console.log('error', error)
            }
        }
    )();
