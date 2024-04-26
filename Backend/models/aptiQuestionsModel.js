import mongoose from "mongoose";
const Schema = mongoose.Schema;

const aptiQuestionsSchema = new Schema({
    question: { type: String, required: true },
    options: {
        type: [String], // Array of strings
        required: true,
        validate: {
            validator: function (v) {
                return v.length === 4; // Return false if length is not 4
            },
            message: 'There must be exactly 4 options for the question.'
        }
    },
    answer: { type: String, required: true }
});


const AptiQuestionsModel = mongoose.model("AptiQuestion", aptiQuestionsSchema);
export default AptiQuestionsModel;