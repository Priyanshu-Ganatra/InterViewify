import AptiQuestionsModel from '../models/aptiQuestionsModel.js';
import CSQuestionsModel from '../models/csQuestionsModel.js';
import CodingQuestionsModel from '../models/codingQuestionsModel.js';

const postAptiQuestion = async (req, res) => {
    const { question, options, answer } = req.body;
    try {
        const newAptiQuestion = new AptiQuestionsModel({ question, options, answer });
        await newAptiQuestion.save();
        res.status(201).json({ message: "Apti question added successfully", details:newAptiQuestion});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const postCSQuestion = async (req, res) => {
    const { question, options, answer } = req.body;
    try {
        const newCSQuestion = new CSQuestionsModel({ question, options, answer });
        await newCSQuestion.save();
        res.status(201).json({ message: "CS question added successfully", details:newCSQuestion});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const postCodingQuestion = async (req, res) => {
    const { question, testCases, examples, difficulty } = req.body;
    try {
        const newCodingQuestion = new CodingQuestionsModel({ question, testCases, examples, difficulty });
        await newCodingQuestion.save();
        res.status(201).json({ message: "Coding question added successfully", details:newCodingQuestion});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getAptiQuestions = async (req, res) => {
    try {
        const aptiQuestions = await AptiQuestionsModel.find();
        res.status(200).json({total: aptiQuestions.length, aptiQuestions});
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

const getCSQuestions = async (req, res) => {
    try {
        const csQuestions = await CSQuestionsModel.find();
        res.status(200).json({total: csQuestions.length, csQuestions});
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

const getCodingQuestions = async (req, res) => {
    try {
        const codingQuestions = await CodingQuestionsModel.find();
        res.status(200).json({total: codingQuestions.length, codingQuestions});
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

export { getAptiQuestions, getCSQuestions, getCodingQuestions, postAptiQuestion, postCSQuestion, postCodingQuestion }