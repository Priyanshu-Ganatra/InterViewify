import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useTestContext } from "@/context/TestContext";
import useFetchQuestions from "@/hooks/useFetchQuestions";
import { toast } from "react-hot-toast"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useUpdateCandidateTestSession from "@/hooks/useUpdateCandidateTestSession";
import useUpdateTestStatus from "@/hooks/useUpdateTestStatus";
import useUpdatePassedRounds from "@/hooks/useUpdatePassedRounds";
import useUpdateTotalRounds from "@/hooks/useUpdateTotalRounds";
import LeaderBoardTable from "@/components/LeaderBoardTable";
import JoinedCandidatesSheet from "@/components/JoinedCandidatesSheet";

function Quiz() {
    document.title = "Ongoing Test - InterViewify"
    const { updateTestStatus } = useUpdateTestStatus();
    const { updateTotalRounds } = useUpdateTotalRounds();
    const navigate = useNavigate();
    const { testCode, currentRound, setCurrentRound, rounds, score, setScore, result, setResult, trace, setTrace, passingCriteria, passedRounds, setPassedRounds, testStatus, setTestStatus } = useTestContext();

    useEffect(() => {
        const handleUnload = (event) => {
            event.preventDefault();
            event.returnValue = ''; // Chrome requires returnValue to be set

            const confirmed = window.confirm('Are you sure you want to leave this page?');
            if (confirmed) {
                window.onbeforeunload = null; // Remove the event listener after confirmation
            } else {
                event.returnValue = ''; // Prevent default behavior if user cancels
            }
        };

        window.addEventListener('beforeunload', handleUnload);

        return () => window.removeEventListener('beforeunload', handleUnload); // Cleanup
    }, []);


    useEffect(() => {
        updateTestStatus('ongoing', testCode);
        updateTotalRounds(rounds.length, testCode);
    }, []);

    const getTimeLimit = (round) => {
        for (let r of rounds) {
            if (r.name === round) {
                return r.timeLimit;
            }
        }
    }
    const { loading, questions, fetchQuestions } = useFetchQuestions();
    const [timeLimit, setTimeLimit] = useState(getTimeLimit(currentRound));

    const getRoundName = (round) => {
        if (round === 'apti') {
            return 'General Aptitude';
        }
        else if (round === 'cs') {
            return 'CS Fundamentals';
        }
        else {
            return 'Coding quiz';
        }
    }
    const [roundName, setRoundName] = useState(getRoundName(currentRound));
    const [timer, setTimer] = useState(timeLimit * 60); // Convert minutes to seconds
    const [isTimeUp, setTimeUp] = useState(false);

    useEffect(() => {
        setTimeLimit(getTimeLimit(currentRound));
        // console.log("currentRound", currentRound, "timeLimit", timeLimit, "trace", trace);
        setTimer(getTimeLimit(currentRound) * 60); // Reset the timer when the round changes
        setTimeUp(false); // Reset time-up state

        const getQuestionsForCurrentRound = async () => {
            for (let round of rounds) {
                if (round.name === currentRound) {
                    // console.log("round.name", round.name);
                    await fetchQuestions(round.name, round.timeLimit)
                    break;
                }
            }
        }
        getQuestionsForCurrentRound();

    }, [currentRound]);

    // Decrement timer every second
    useEffect(() => {
        const interval = setInterval(() => {
            setTimer(prevTime => prevTime - 1);
        }, 1000);
        // Clear interval when unmounting to avoid memory leaks
        return () => clearInterval(interval);
    }, []);

    // Check if time is up
    useEffect(() => {
        if (timer <= 0) {
            setTimeUp(true);
            handleSubmit(); // Automatically submit round when time is up
        }
    }, [timer]);

    // useEffect(() => {
    //     console.log("questions", questions);
    //     console.log("trace", trace);
    //     console.log("result", result);
    // }, [questions, trace, result]);

    const handleNext = () => {
        if (trace < timeLimit - 1) {
            // If the user hasn't selected an option, push null to the result array
            if (result[trace] === undefined) {
                const updatedResult = [...result];
                updatedResult[trace] = null;
                setResult(updatedResult);
            }
            setTrace(trace + 1);
        }
    }

    const handlePrev = () => {
        if (trace > 0) {
            setTrace(trace - 1);
        }
    }
    const [questionStartTimes, setQuestionStartTimes] = useState([]);
    const [lockedQuestionOptions, setLockedQuestionOptions] = useState([])
    const [correctQuestionsCount, setCorrectQuestionsCount] = useState(0);

    const hasQuestionBonusTimeElapsed = (trace) => {
        for (let elem of questionStartTimes) {
            if (elem.trace === trace) {
                const currentTime = new Date().getTime();
                const timeElapsed = currentTime - elem.startTime;
                if (timeElapsed > 10000) {
                    return true;
                }
            }
        }
        return false;
    }

    const handleOptionSelect = (optionText) => {
        const resultCopy = [...result]; // Copy the result array
        resultCopy[trace] = optionText; // Set the selected option in the result array
        setResult(resultCopy); // Update the result state

        const currentQuestion = questions[trace];
        // Check if the selected option is correct
        if (currentQuestion.answer === optionText) {
            // Lock the question options so that the user can't change the answer
            setLockedQuestionOptions([...lockedQuestionOptions, trace])
            setCorrectQuestionsCount(correctQuestionsCount + 1);

            // Check if the time elapsed is within 10 seconds
            if (!hasQuestionBonusTimeElapsed(trace)) {
                // Increase the current score by 20 points
                setScore(score + 20);

                // Show a toast for earning bonus points
                toast.success("Earned bonus points, Score +20 pts");
            }
            else {
                // Increase the current score by 10 points
                setScore(score + 10);
                toast.success("Score +10 pts");
            }
        }
        else {
            toast.error("Incorrect answer: -5 pts");
            setScore(score - 5);
            setLockedQuestionOptions([...lockedQuestionOptions, trace])
        }
    }

    useEffect(() => {
        const doQuestionStartTimesIncludeThisTrace = (trace) => {
            for (let elem of questionStartTimes) {
                if (elem.trace === trace) {
                    return true;
                }
            }
            return false;
        }

        if (!loading && questions[trace]) {
            // Push the start time of the current question if it's not present already in the state
            if (!doQuestionStartTimesIncludeThisTrace(trace)) {
                const elem = {
                    trace: trace,
                    startTime: new Date().getTime()
                }
                setQuestionStartTimes([...questionStartTimes, elem]);
            }
        }
    }, [loading, questions, trace]);

    const isSelected = (optionText) => {
        return result[trace] === optionText;
    }

    // Function to calculate the number of attempted questions
    const getAttemptedQuestionsCount = () => {
        return result.filter(option => option !== null).length;
    }

    const getNextRound = (currentRound) => {
        const currentRoundIndex = rounds.findIndex(round => round.name === currentRound);
        if (currentRoundIndex !== -1 && currentRoundIndex < rounds.length - 1) {
            return rounds[currentRoundIndex + 1].name;
        }
        return null; // Return null if there is no next round
    }

    const { updatePassedRounds } = useUpdatePassedRounds();
    const handleSubmit = () => {
        // Calculate the percentage of correctly answered questions, timelimit is same as the amount of total questions
        const percentageCorrect = (correctQuestionsCount / timeLimit) * 100;

        // Check if the user passes the current round
        if (percentageCorrect >= passingCriteria) {
            setPassedRounds(passedRounds + 1);
            updatePassedRounds(passedRounds + 1, testCode);
            const nextRound = getNextRound(currentRound)
            if (nextRound) {
                setRoundName(getRoundName(nextRound));
                setTrace(0);
                setQuestionStartTimes([]);
                setLockedQuestionOptions([]);
                setCorrectQuestionsCount(0);
                setResult([]);
                setCurrentRound(nextRound);
                toast.success("You've passed the round! Proceeding to the next...");
            }
            else {
                setScore(0)
                setTrace(0);
                setRoundName('');
                setQuestionStartTimes([]);
                setLockedQuestionOptions([]);
                setCorrectQuestionsCount(0);
                setResult([]);
                setCurrentRound('');
                setPassedRounds(0);
                toast.success("You've passed the test! Congratulations!");
                updateTestStatus('ended', testCode);
                navigate('/leaderboard/' + testCode);
            }

        } else {
            // End the test as the user did not pass the current round
            setScore(0)
            setTrace(0);
            setRoundName('');
            setQuestionStartTimes([]);
            setLockedQuestionOptions([]);
            setCorrectQuestionsCount(0);
            setResult([]);
            setCurrentRound('');
            setPassedRounds(0);
            toast.error("You've failed the round.");
            updateTestStatus('ended', testCode);
            navigate('/leaderboard/' + testCode);
        }
    }

    // useEffect(() => {
    //     console.log(passedRounds);
    // }, [passedRounds]);

    // Function to format remaining time as "mm:ss"
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const { updateCandidateTestSession } = useUpdateCandidateTestSession()

    useEffect(() => {
        // console.log(score, currentRound, passedRounds);
        const updateTestSessionInBackend = async () => {
            try {
                await updateCandidateTestSession(score, currentRound, testCode);
            } catch (error) {
                toast.error(error.message);
            }
        }
        updateTestSessionInBackend();
    }, [score, currentRound, passedRounds]);


    return (
        <div className="min-h-screen text-white bg-gray-900">
            <nav className="flex items-center justify-between p-4 bg-gray-800">
                <div>
                    <b><span className="mr-8">Current round: {roundName}{` (${passedRounds + 1}/${rounds.length})`}</span></b>
                    <span className="mr-8">Score: {score}</span>
                    <span className="mr-8">Time Remaining: {formatTime(timer)} mins</span>
                    {/* total questions amount is same as timeLimit of the round */}
                    <span>Attempted Questions: {getAttemptedQuestionsCount()}/{timeLimit}</span>
                </div>
                <div className="space-x-4">
                    <JoinedCandidatesSheet testCode={testCode}></JoinedCandidatesSheet>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>View Leaderboard</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-[800px] max-h-[90vh] overflow-auto">
                            <DialogTitle>Live Leaderboard</DialogTitle>
                            <LeaderBoardTable inTest="true" />
                            <DialogHeader>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                </div>
            </nav>
            <div className="flex flex-col items-center justify-center h-full">
                <div className="p-8">
                    <h2 className="mb-4 text-2xl">
                        {loading ? <span className='flex justify-center'><span className="loading loading-spinner"></span></span> : `${trace + 1}. ` + questions[trace]?.question}
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        {questions[trace]?.options.map((option, index) => (
                            <button
                                key={index}
                                className={`p-4 rounded ${isSelected(option) ? 'bg-blue-500 text-white' : 'bg-gray-700 hover:bg-gray-600'
                                    } ${isSelected(option) && 'disabled:bg-blue-500 disabled:cursor-not-allowed'}
                                    ${!isSelected(option) && 'disabled:bg-gray-500 disabled:cursor-not-allowed'}`}
                                onClick={() => handleOptionSelect(option)}
                                disabled={lockedQuestionOptions.includes(trace)}
                                title={lockedQuestionOptions.includes(trace) ? "You have already answered this question" : null}
                            >
                                {loading ? <span className='flex justify-center'><span className="loading loading-spinner"></span></span> : option}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 flex justify-between p-4">
                    {trace > 0 ? (
                        <button
                            className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
                            onClick={handlePrev}
                        >
                            Prev
                        </button>
                    ) :
                        (
                            <button
                                className="px-4 py-2 font-bold text-white bg-gray-500 rounded cursor-not-allowed"
                            >
                                Prev
                            </button>
                        )
                    }
                    {trace < timeLimit - 1 ? (
                        <button
                            className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
                            onClick={handleNext}
                        >
                            Next
                        </button>
                    ) :
                        (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        className="px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700 h-10"
                                    >
                                        Submit
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Confirm round submission</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will submit your current round's answers and they'll be matched with this round's passing criteria.
                                            If you pass you can move to the next round, else your test will end.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleSubmit}>Continue</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                </div>
            </div>
        </div>
    );
}

export default Quiz;
