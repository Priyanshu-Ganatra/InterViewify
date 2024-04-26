import TestModel from '../models/testModel.js';
import CandidateTestSessionModel from '../models/candidateTestSessionModel.js'
import LeaderboardModel from '../models/leaderboardModel.js'
import UserModel from '../models/userModel.js'

// add a new test - done by test admin
export const configureTest = async (req, res) => {
    let { testCode, rounds, passingCriteria } = req.body;
    // console.log(passingCriteria, testCode, rounds[0].name);

    if (!testCode || rounds.length == 0 || !passingCriteria) {
        res.status(400).json({ error: "All fields are required" });
    }

    try {
        const existingTest = await TestModel.findOne({ testCode });
        // update the existing test
        if (existingTest) {
            existingTest.rounds = rounds;
            existingTest.passingCriteria = passingCriteria;
            await existingTest.save();
            res.status(201).json({ message: "Test re-configured successfully", existingTest });
        }
        // create a new test and a new leaderboard
        else {
            const newTest = new TestModel({
                testCode,
                rounds,
                passingCriteria,
            });

            const newLeaderboard = new LeaderboardModel({
                testCode,
            });

            await Promise.all([newTest.save(), newLeaderboard.save()]);
            res.status(201).json({ message: "Test configured successfully", newTest });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// start a test - done by test admin
export const startTest = async (req, res) => {
    const { testCode } = req.body;

    if (!testCode) return res.status(400).json({ error: "Testcode not provided" });

    try {
        const test = await TestModel.findOne({ testCode });
        if (!test) return res.status(400).json({ error: "Test not found" });

        test.state = "started";
        await test.save();

        res.status(201).json({ message: "Test has started", test });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// join a test - done by candidates
export const joinTest = async (req, res) => {
    const { testCode, _id } = req.body

    if (!testCode) return res.status(400).json({ error: "Testcode not provided" });

    try {
        const test = await TestModel.findOne({ testCode });
        if (!test) return res.status(400).json({ error: "Test not found!" });
        const hasAlreadyJoined = await CandidateTestSessionModel.findOne({ testCode, candidateId: _id });
        if (hasAlreadyJoined) return res.status(400).json({ error: "You had already joined the test" });

        const candidateTestSession = new CandidateTestSessionModel({
            testCode,
            candidateId: _id,
        });

        const leaderboardData = await LeaderboardModel.findOne({ testCode });
        // add the candidate to the test and the leaderboard
        test.candidates.push(_id);
        leaderboardData.candidateDetails.push(candidateTestSession._id);

        // save the test, candidateTestSession and leaderboardData
        await Promise.all([candidateTestSession.save(), test.save(), leaderboardData.save()]);

        res.status(201).json({ message: "Joined test successfully", candidateTestSession });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const getLeaderboardData = async (req, res) => {
    const testCode = req.params.id;

    if (!testCode) return res.status(400).json({ error: "Testcode not provided" });

    try {
        // console.log(testCode);
        const leaderboardData = await LeaderboardModel.findOne({ testCode })
            .populate({
                path: 'candidateDetails',
                populate: {
                    path: 'candidateId',
                    model: UserModel
                }
            }).select({ candidateDetails: 1, _id: 0 });

        if (!leaderboardData) return res.status(400).json({ error: "Leaderboard not found" });

        if (leaderboardData.candidateDetails.length === 0) return res.status(400).json({ message: "Waiting for candidates to score some points" });

        res.status(200).json(leaderboardData);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const updateCandidateTestSession = async (req, res) => {
    const { id, round, score, testCode } = req.body;

    try {
        const candidateTestSession = await CandidateTestSessionModel.findOne({ candidateId: id, testCode });

        if (!candidateTestSession) return res.status(400).json({ error: "Candidate Test session not found" });

        candidateTestSession.currentRound = round;
        candidateTestSession.score = score;

        await candidateTestSession.save();

        res.status(201).json({ message: "Test session updated successfully", candidateTestSession });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const updateTestStatus = async (req, res) => {
    const { id, testCode, testStatus } = req.body;
    // console.log(id, testCode, testStatus);

    try {
        const candidateTestSession = await CandidateTestSessionModel.findOne({ testCode, candidateId: id});
        if (!candidateTestSession) return res.status(400).json({ error: "Candidate Test session not found" });
        candidateTestSession.testStatus = testStatus;
        await candidateTestSession.save();
        res.status(201).json({ message: "Test status updated successfully", candidateTestSession });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const updatePassedRounds = async (req, res) => {
    const { id, testCode, passedRounds } = req.body;

    try {
        const candidateTestSession = await CandidateTestSessionModel.findOne({ testCode, candidateId: id});
        if (!candidateTestSession) return res.status(400).json({ error: "Candidate Test session not found" });
        candidateTestSession.passedRounds = passedRounds;
        await candidateTestSession.save();
        res.status(201).json({ message: "Passed rounds updated successfully", candidateTestSession });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const updateTotalRounds = async (req, res) => {
    const { id, testCode, totalRounds } = req.body;

    try {
        const candidateTestSession = await CandidateTestSessionModel.findOne({ testCode, candidateId: id});
        if (!candidateTestSession) return res.status(400).json({ error: "Candidate Test session not found" });
        candidateTestSession.totalRounds = totalRounds;
        await candidateTestSession.save();
        res.status(201).json({ message: "Passed rounds updated successfully", candidateTestSession });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const getJoinedCandidates = async (req, res) => {
    const testCode = req.params.testCode
    if (!testCode) return res.status(400).json({ error: "Testcode not provided" });

    try {
        // console.log(testCode);
        const test = await TestModel.find({ testCode }).select({ candidates: 1, _id: 0 })
        // console.log(test);
        if (!test) return res.status(400).json({ error: "Test not found" });

        const candidateIds = test[0].candidates;
        const candidateDetails = [];

        if (candidateIds.length === 0) return res.status(400).json({ message: "Waiting for candidates to join the test..." });

        await Promise.all(candidateIds.map(async (candidateId) => {
            const candidate = await UserModel.findById(candidateId);
            const name = candidate.name;
            const profilePic = candidate.profilePic;
            candidateDetails.push({ name, profilePic });
        }));

        res.status(200).json({ candidateDetails });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const getTestDetails = async (req, res) => {
    const testCode = req.params.testCode
    if (!testCode) return res.status(400).json({ error: "Testcode not provided" });

    try {
        const test = await TestModel.findOne({ testCode });
        if (!test) return res.status(400).json({ error: "Test not found" });

        res.status(200).json({ test });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const hasTestStarted = async (req, res) => {
    const testCode = req.params.testCode
    if (!testCode) return res.status(400).json({ error: "Testcode not provided" });

    try {
        const test = await TestModel.findOne({ testCode });
        if (!test) return res.status(400).json({ error: "Test not found" });

        if (test.state === "started") {
            res.status(200).json({ testStarted: true });
        } else {
            res.status(200).json({ testStarted: false });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const leaderBoardExists = async (req, res) => {
    const testCode = req.params.testCode
    if (!testCode) return res.status(400).json({ error: "Testcode not provided" });

    try {
        const leaderboardData = await LeaderboardModel.findOne({ testCode });
        if (!leaderboardData) return res.status(400).json({ error: "Test not found!" });

        res.status(200).json(true);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}