import mongoose from "mongoose";
const Schema = mongoose.Schema;

// test session details for each candidate
const leaderboardSchema = new Schema({
    testCode: { type: String, required: true },
    candidateDetails: [
        { type: Schema.Types.ObjectId, ref: 'CandidateTestSession' }
    ]
});

const LeaderboardModel = mongoose.model("leaderboard", leaderboardSchema);
export default LeaderboardModel;
