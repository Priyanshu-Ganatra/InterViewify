import { createContext, useContext, useState } from "react";
export const TestContext = createContext(null);

export const useTestContext = () => {
    return useContext(TestContext);
};
    
export const TestContextProvider = ({ children }) => {

    const [testCode, setContextTestCode] = useState()
    const [currentRound, setCurrentRound] = useState()
    const [score, setScore] = useState(0)
    const [testStatus, setTestStatus] = useState('not started')
    const [passedRounds, setPassedRounds] = useState(0)
    const [rounds, setRounds] = useState()
    const [passingCriteria, setPassingCriteria] = useState()
    const [questions, setQuestions] = useState([])
    const [result, setResult] = useState([])
    const [trace, setTrace] = useState(0)

    return <TestContext.Provider value={{testCode, setContextTestCode, currentRound, setCurrentRound, score, setScore, testStatus, setTestStatus, passedRounds, setPassedRounds, rounds, setRounds, passingCriteria, setPassingCriteria, questions, setQuestions, result, setResult, trace, setTrace }}>{children}</TestContext.Provider>
    
};