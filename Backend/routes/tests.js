import express from 'express';
import { leaderBoardExists, updatePassedRounds, updateTotalRounds, configureTest, joinTest, getLeaderboardData, updateCandidateTestSession, startTest, getJoinedCandidates, getTestDetails, hasTestStarted, updateTestStatus } from '../controllers/testsController.js';
const router = express.Router();
// import protectRoute from '../middleware/protectRoute.js';

// configure a test 
router.post('/configure', configureTest)

router.post('/start', startTest)

router.post('/join', joinTest)

router.put('/updateCandidateTestSession', updateCandidateTestSession)

router.put('/updateTestStatus', updateTestStatus)

router.put('/updatePassedRounds', updatePassedRounds)

router.put('/updateTotalRounds', updateTotalRounds)

router.get('/leaderboard/:id', getLeaderboardData)

router.get('/joinedCandidates/:testCode', getJoinedCandidates)

router.get('/testDetails/:testCode', getTestDetails)

router.get('/hasTestStarted/:testCode', hasTestStarted)

router.get('/leaderBoardExists/:testCode', leaderBoardExists)

export default router;