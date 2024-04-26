import express from 'express';
import {
    getAptiQuestions, getCSQuestions, getCodingQuestions, postAptiQuestion,
    postCSQuestion, postCodingQuestion
} from '../controllers/questionsController.js';

const router = express.Router();

// get aptitude questions 
router.get('/apti', getAptiQuestions)

// get cs fundamentals questions 
router.get('/cs', getCSQuestions)

// get coding questions 
router.get('/coding', getCodingQuestions)

// post a aptitude question
router.post('/apti', postAptiQuestion)

// post a cs fundamentals question
router.post('/cs', postCSQuestion)

// post a coding question
router.post('/coding', postCodingQuestion)

export default router;