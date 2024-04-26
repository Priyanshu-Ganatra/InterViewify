import mongoose from "mongoose";
const Schema = mongoose.Schema;

// test details configured by admin
const testSchema = new Schema({
    testCode: { type: String, required: true, unique: true }, // Unique test code
    rounds: [
        {
            "name": { type: String, required: true },
            "timeLimit": { type: Number, required: true },
        },
    ],
    passingCriteria: { type: Number, required: true }, // Passing criteria for MCQ rounds
    state: { type: String, required: true, default: 'not started', emum: ["started", "not started", "ended"] }, // Test state (not started, started, ended)
    candidates: [ // Candidates who have joined the test
        {type: Schema.Types.ObjectId, ref: 'user'}
    ]
})

const TestModel = mongoose.model("test", testSchema);
export default TestModel;