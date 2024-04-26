import mongoose from "mongoose";
const Schema = mongoose.Schema;

// test session details for each candidate
const candidateTestSessionSchema = new Schema({
    testCode: { type: String, required: true },
    candidateId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    currentRound: { type: String, default: '' },
    passedRounds: {type: Number, default: 0},
    totalRounds: {type: Number, default: 0},
    score: { type: Number, default: 0 },
    testStatus: { type: String, enum: ['not started', 'ongoing', 'ended'], default: 'not started' },
});

const CandidateTestSessionModel = mongoose.model("CandidateTestSession", candidateTestSessionSchema);
export default CandidateTestSessionModel;
